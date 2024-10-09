import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    
    const currentYear = new Date().getFullYear();
    const mediaRequestsThisYear = await prisma.mediaRequest.count({
      where: {
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
    });

    return NextResponse.json({ userCount, mediaRequestsThisYear });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}