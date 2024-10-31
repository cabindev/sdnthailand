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
  try {
    // ตรวจสอบ Content-Type
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const image = formData.get('image') as File | null;

      let imageUrl: string | undefined;

      if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `profile_${Date.now()}.webp`;
        const filePath = path.join(process.cwd(), 'public', 'images', fileName);
        
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
    } else {
      // สำหรับการอัพเดท role
      const data = await req.json();
      if (data.role) {
        const updatedUser = await prisma.user.update({
          where: { id: Number(params.id) },
          data: { role: data.role },
        });
        return NextResponse.json(updatedUser);
      }
    }

    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ลบ user
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}