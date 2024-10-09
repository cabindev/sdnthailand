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
    const procurement = await prisma.procurement.findUnique({
      where: { id: params.id },
      include: { announceResults: true }
    });

    if (!procurement) {
      return NextResponse.json({ error: 'Procurement not found' }, { status: 404 });
    }

    return NextResponse.json(procurement);
  } catch (error) {
    console.error('Error fetching procurement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const projectCode = formData.get('projectCode') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const status = formData.get('status') as ProcurementStatus;
    const coverImage = formData.get('coverImage') as File | null;
    const pdfFile = formData.get('pdfFile') as File | null;

    let coverImagePath = undefined;
    let pdfFilePath = undefined;

    const oldProcurement = await prisma.procurement.findUnique({ where: { id: params.id } });
    if (!oldProcurement) {
      return NextResponse.json({ error: 'Procurement not found' }, { status: 404 });
    }

    if (coverImage) {
      if (oldProcurement.coverImage) {
        const oldFilePath = path.join(process.cwd(), 'public', oldProcurement.coverImage.slice(1));
        await unlink(oldFilePath).catch(console.error);
      }

      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const filename = `${Date.now()}-${coverImage.name}`;
      const filepath = path.join(process.cwd(), 'public', 'procurement', 'cover', filename);
      await writeFile(filepath, buffer);
      coverImagePath = `/procurement/cover/${filename}`;
    }

    if (pdfFile) {
      if (oldProcurement.pdfFile) {
        const oldFilePath = path.join(process.cwd(), 'public', oldProcurement.pdfFile.slice(1));
        await unlink(oldFilePath).catch(console.error);
      }

      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const filename = `${Date.now()}-${pdfFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'procurement', 'pdf', filename);
      await writeFile(filepath, buffer);
      pdfFilePath = `/procurement/pdf/${filename}`;
    }

    const updatedProcurement = await prisma.procurement.update({
      where: { id: params.id },
      data: {
        projectCode,
        title,
        description,
        startDate,
        endDate,
        status,
        ...(coverImagePath && { coverImage: coverImagePath }),
        ...(pdfFilePath && { pdfFile: pdfFilePath }),
      },
    });

    revalidatePath('/dashboard/procurement/admin');
    revalidatePath('/procurement');
    revalidatePath(`/procurement/${params.id}`);

    return NextResponse.json(updatedProcurement);
  } catch (error) {
    console.error('Error updating procurement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const procurement = await prisma.procurement.findUnique({ 
      where: { id: params.id },
      include: { announceResults: true }
    });

    if (!procurement) {
      return NextResponse.json({ error: 'Procurement not found' }, { status: 404 });
    }

    // ลบ AnnounceResult ที่เกี่ยวข้องและไฟล์ PDF ของแต่ละ AnnounceResult
    for (const announceResult of procurement.announceResults) {
      if (announceResult.pdfFile) {
        const pdfFilePath = path.join(process.cwd(), 'public', announceResult.pdfFile.slice(1));
        await unlink(pdfFilePath).catch(console.error);
      }
      await prisma.announceResult.delete({ where: { id: announceResult.id } });
    }

    // ลบไฟล์ coverImage ของ Procurement ถ้ามี
    if (procurement.coverImage) {
      const coverImagePath = path.join(process.cwd(), 'public', procurement.coverImage.slice(1));
      await unlink(coverImagePath).catch(console.error);
    }

    // ลบไฟล์ pdfFile ของ Procurement ถ้ามี
    if (procurement.pdfFile) {
      const pdfFilePath = path.join(process.cwd(), 'public', procurement.pdfFile.slice(1));
      await unlink(pdfFilePath).catch(console.error);
    }

    // ลบ procurement
    await prisma.procurement.delete({ where: { id: params.id } });

    revalidatePath('/dashboard/procurement/admin');
    revalidatePath('/procurement');

    return NextResponse.json({ message: 'Procurement and related announce results deleted successfully' });
  } catch (error) {
    console.error('Error deleting procurement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}