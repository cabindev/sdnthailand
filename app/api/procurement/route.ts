import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

type ProcurementStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get('sort') || 'desc';

  try {
    const procurements = await prisma.procurement.findMany({
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
    });
    return NextResponse.json({ procurements, totalItems: procurements.length });
  } catch (error) {
    console.error('Error in GET /api/procurement:', error);
    return NextResponse.json({ error: 'Failed to fetch procurements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    if (!projectCode || !title || !description || !startDate || !endDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existingProcurement = await prisma.procurement.findUnique({
      where: { projectCode },
    });

    if (existingProcurement) {
      return NextResponse.json({ error: 'Project code already exists' }, { status: 400 });
    }

    let coverImagePath = '';
    let pdfFilePath = '';

    if (coverImage) {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${coverImage.name}`;
      const filepath = path.join(process.cwd(), 'public', 'procurement', 'cover', filename);
      await writeFile(filepath, buffer);
      coverImagePath = `/procurement/cover/${filename}`;
    }

    if (pdfFile) {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${pdfFile.name}`;
      const filepath = path.join(process.cwd(), 'public', 'procurement', 'pdf', filename);
      await writeFile(filepath, buffer);
      pdfFilePath = `/procurement/pdf/${filename}`;
    }

    const procurement = await prisma.procurement.create({
      data: {
        projectCode,
        title,
        description,
        startDate,
        endDate,
        status,
        coverImage: coverImagePath,
        pdfFile: pdfFilePath,
      },
    });

    return NextResponse.json(procurement, { status: 201 });
  } catch (error) {
    console.error('Error creating procurement:', error);
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Project code must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// เพิ่ม API endpoint สำหรับตรวจสอบ projectCode
export async function HEAD(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectCode = searchParams.get('projectCode');

  if (!projectCode) {
    return NextResponse.json({ error: 'Project code is required' }, { status: 400 });
  }

  try {
    const existingProcurement = await prisma.procurement.findUnique({
      where: { projectCode },
    });

    if (existingProcurement) {
      return new Response(null, { status: 409 }); // Conflict
    } else {
      return new Response(null, { status: 200 }); // OK
    }
  } catch (error) {
    console.error('Error checking project code:', error);
    return new Response(null, { status: 500 }); // Internal Server Error
  }
}