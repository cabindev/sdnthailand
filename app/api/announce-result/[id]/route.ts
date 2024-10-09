import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type ProcurementStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const announceResult = await prisma.announceResult.findUnique({
      where: { id },
      include: {
        procurement: {
          select: {
            id: true,
            projectCode: true,
            title: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!announceResult) {
      return NextResponse.json({ error: 'Announce result not found' }, { status: 404 });
    }

    return NextResponse.json(announceResult);
  } catch (error) {
    console.error('Error in GET /api/announce-result/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch announce result' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const formData = await request.formData();
    const pdfFile = formData.get('pdfFile') as File | null;

    const announceResult = await prisma.announceResult.findUnique({ 
      where: { id },
      include: { procurement: true },
    });
    if (!announceResult) {
      return NextResponse.json({ error: 'Announce result not found' }, { status: 404 });
    }

    let pdfFilePath = announceResult.pdfFile;

    if (pdfFile) {
      // Delete old PDF file if exists
      if (announceResult.pdfFile) {
        const oldFilePath = path.join(process.cwd(), 'public', announceResult.pdfFile);
        await unlink(oldFilePath).catch(console.error);
      }

      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${pdfFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'procurement', 'pdf-announced', filename);
      await writeFile(filepath, buffer);
      pdfFilePath = `/procurement/pdf-announced/${filename}`;
    }

    const updatedAnnounceResult = await prisma.announceResult.update({
      where: { id },
      data: {
        pdfFile: pdfFilePath,
        announcedDate: new Date(),
      },
    });

    // Update procurement status to CLOSED if not already
    if (announceResult.procurement.status !== 'CLOSED') {
      await prisma.procurement.update({
        where: { id: announceResult.procurementId },
        data: { status: 'CLOSED' as ProcurementStatus },
      });
    }

    revalidatePath('/dashboard/procurement/announce-result');
    revalidatePath(`/dashboard/procurement/announce-result/${id}`);

    return NextResponse.json(updatedAnnounceResult);
  } catch (error) {
    console.error('Error in PUT /api/announce-result/[id]:', error);
    return NextResponse.json({ error: 'Failed to update announce result' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const announceResult = await prisma.announceResult.findUnique({
      where: { id },
      include: { procurement: true },
    });

    if (!announceResult) {
      return NextResponse.json({ error: 'Announce result not found' }, { status: 404 });
    }

    // Delete PDF file if exists
    if (announceResult.pdfFile) {
      const pdfFilePath = path.join(process.cwd(), 'public', announceResult.pdfFile);
      await unlink(pdfFilePath).catch(console.error);
    }

    // Delete the announce result
    await prisma.announceResult.delete({ where: { id } });

    // Update procurement status back to OPEN if it was CLOSED
    if (announceResult.procurement.status === 'CLOSED') {
      await prisma.procurement.update({
        where: { id: announceResult.procurementId },
        data: { status: 'OPEN' as ProcurementStatus },
      });
    }

    revalidatePath('/dashboard/procurement/announce-result');
    revalidatePath(`/procurement/${announceResult.procurementId}`);

    return NextResponse.json({ message: 'Announce result deleted successfully' });
  } catch (error) {
    console.error('Error deleting announce result:', error);
    return NextResponse.json({ error: 'Failed to delete announce result' }, { status: 500 });
  }
}