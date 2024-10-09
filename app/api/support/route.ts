import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/configs/auth/authOptions';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const file = formData.get('file') as File | null;
    const { id: userId, email, firstName, lastName } = session.user;

    if (!subject || !message || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let filePath = '';

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the upload directory exists
      await mkdir(uploadDir, { recursive: true });
      
      const fullPath = path.join(uploadDir, filename);
      await writeFile(fullPath, buffer);
      filePath = `/uploads/${filename}`;
    }

    const mediaRequest = await prisma.mediaRequest.create({
      data: {
        userId: Number(userId), // Ensure userId is a number
        subject,
        message,
        phoneNumber,
        filePath: filePath || null, // Use null if no file was uploaded
      }
    });

    // Email sending configuration
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>คำขอสื่อรณรงค์ใหม่</title>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px 0; border-bottom: 2px solid #f58220; }
          .content { padding: 20px 0; }
          .footer { padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #888; }
          .logo { width: 100px; height: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header text-center justify-center">
            <img src="cid:logo" alt="SDN Thailand Logo" class="logo">
          </div>
          <div class="content">
            <h1 style="color: #f58220;">คำขอสื่อรณรงค์ใหม่</h1>
            <p><strong>จาก:</strong> ${firstName} ${lastName}</p>
            <p><strong>อีเมล:</strong> ${email}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> ${phoneNumber}</p>
            <p><strong>หัวข้อ:</strong> ${subject}</p>
            <p><strong>ข้อความ:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 5px solid #f58220;">
              ${message}
            </p>
            ${filePath ? '<p><strong>ไฟล์แนบ:</strong> มีไฟล์แนบมาด้วย</p>' : ''}
          </div>
          <div class="footer">
            <p>สำนักงานเครือข่ายองค์กรงดเหล้า (สคล.) มุ่งมั่นส่งเสริมและสนับสนุนการดำเนินงานในทุกภาคส่วนของสังคม เพื่อลดผลกระทบและความเสี่ยงจากการบริโภคเครื่องดื่มแอลกอฮอล์ ร่วมสร้างสรรค์สังคมไทยให้เข้มแข็งและปลอดภัยอย่างยั่งยืน</p>
            <p>© 2024 SDN Thailand. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: '"SDN Thailand" <sdnthailandbackup@gmail.com>',
      to: "evo_reaction@hotmail.com, tom_teera@hotmail.com, bosupaluk@hotmail.com",
      subject: `คำขอสื่อรณรงค์ใหม่: ${subject}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'logo.png'),
          cid: 'logo'
        },
        ...(filePath ? [{
          filename: path.basename(filePath),
          path: path.join(process.cwd(), 'public', filePath)
        }] : [])
      ]
    });

    return NextResponse.json({ 
      message: 'คำขอสื่อรณรงค์ถูกส่งเรียบร้อยแล้ว', 
      requestId: mediaRequest.id 
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing media request:', error);
    return NextResponse.json({ error: 'ไม่สามารถดำเนินการคำขอได้ โปรดลองอีกครั้ง' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const requestCount = await prisma.mediaRequest.count();
    return NextResponse.json({ requestCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching request count:', error);
    return NextResponse.json({ error: 'ไม่สามารถดึงจำนวนคำขอได้' }, { status: 500 });
  }
}