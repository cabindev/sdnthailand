import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true, 
      },
      orderBy: {
        id: 'asc' 
      }
    });

    // แปลงข้อมูลเพื่อจัดการกรณีที่ image เป็น null
    const formattedUsers = users.map(user => ({
      ...user,
      image: user.image || '/images/default-avatar.png' // ถ้า image เป็น null ให้ใช้รูป default
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}