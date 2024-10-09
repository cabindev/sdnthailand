import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const announcements = await prisma.announceResult.findMany({
      include: {
        procurement: {
          select: {
            projectCode: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { announcedDate: 'desc' },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error in GET /api/announce-result:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const procurementId = formData.get('procurementId') as string;
    const pdfFile = formData.get('pdfFile') as File;

    if (!procurementId || !pdfFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save PDF file
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${pdfFile.name}`;
    const filepath = path.join(process.cwd(), 'public', 'procurement', 'pdf-announced', filename);
    await writeFile(filepath, buffer);

    // Create AnnounceResult
    const announceResult = await prisma.announceResult.create({
      data: {
        procurementId: procurementId,
        pdfFile: `/procurement/pdf-announced/${filename}`,
      },
    });

    // Update Procurement status
    await prisma.procurement.update({
      where: { id: procurementId },
      data: { status: 'CLOSED' },
    });

    return NextResponse.json(announceResult, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/announce-result:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}