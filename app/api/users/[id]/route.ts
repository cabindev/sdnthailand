import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const image = formData.get('image') as File | null;

  let imageUrl: string | undefined;

  try {
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = new Date().getTime();
      const fileName = `profile_${timestamp}${path.extname(image.name)}`;
      const filePath = `./public/images/${fileName}`;
      
      await writeFile(filePath, buffer);
      imageUrl = `/images/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        firstName,
        lastName,
        email,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}