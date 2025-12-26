import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 3) { // Max 3 requests per minute
    return false;
  }

  limit.count++;
  return true;
}

function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Remove < and > to prevent basic XSS
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่' }, { status: 429 });
    }

    const formData = await request.formData();
    const name = sanitizeInput(formData.get('name') as string, 100);
    const email = sanitizeInput(formData.get('email') as string, 100);
    const phone = sanitizeInput(formData.get('phone') as string, 20);
    const subject = sanitizeInput(formData.get('subject') as string, 200);
    const message = sanitizeInput(formData.get('message') as string, 5000);
    const file = formData.get('file') as File | null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 400 });
    }

    let filePath = '';
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'ไฟล์มีขนาดใหญ่เกิน 10MB' }, { status: 400 });
      }

      // Validate file type by MIME type
      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: 'ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาพ PDF และรูปภาพเท่านั้น' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename - remove special characters and limit length
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-_]/g, '_')
        .substring(0, 100);
      const filename = `${Date.now()}-${sanitizedName}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'contact');

      // Ensure the upload directory exists
      await mkdir(uploadDir, { recursive: true });

      const fullPath = path.join(uploadDir, filename);
      await writeFile(fullPath, buffer);
      filePath = `/uploads/contact/${filename}`;
    }

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

    // Prepare admin email content
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ข้อความติดต่อใหม่</title>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px 0; border-bottom: 2px solid #f58220; text-align: center; }
          .content { padding: 20px 0; }
          .footer { padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #888; }
          .logo { width: 100px; height: auto; }
          .info-row { background-color: #f9f9f9; padding: 10px; margin: 10px 0; border-left: 5px solid #f58220; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="SDN Thailand Logo" class="logo">
          </div>
          <div class="content">
            <h1 style="color: #f58220;">ข้อความติดต่อใหม่จากเว็บไซต์</h1>

            <div class="info-row">
              <p><strong>ชื่อ:</strong> ${name}</p>
            </div>

            <div class="info-row">
              <p><strong>อีเมล:</strong> ${email}</p>
            </div>

            ${phone ? `
            <div class="info-row">
              <p><strong>เบอร์โทรศัพท์:</strong> ${phone}</p>
            </div>
            ` : ''}

            <div class="info-row">
              <p><strong>หัวข้อ:</strong> ${subject}</p>
            </div>

            <div class="info-row">
              <p><strong>ข้อความ:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>

            ${filePath ? '<p><strong>ไฟล์แนบ:</strong> มีไฟล์แนบมาด้วย</p>' : ''}

            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              ส่งเมื่อ: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div class="footer">
            <p>สำนักงานเครือข่ายองค์กรงดเหล้า (สคล.) มุ่งมั่นส่งเสริมและสนับสนุนการดำเนินงานในทุกภาคส่วนของสังคม เพื่อลดผลกระทบและความเสี่ยงจากการบริโภคเครื่องดื่มแอลกอฮอล์ ร่วมสร้างสรรค์สังคมไทยให้เข้มแข็งและปลอดภัยอย่างยั่งยืน</p>
            <p>© 2024 SDN Thailand. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Prepare user confirmation email content
    const userEmailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ยืนยันการรับข้อความ</title>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px 0; border-bottom: 2px solid #f58220; text-align: center; }
          .content { padding: 20px 0; }
          .footer { padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #888; }
          .logo { width: 100px; height: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="SDN Thailand Logo" class="logo">
          </div>
          <div class="content">
            <h1 style="color: #f58220;">ขอบคุณที่ติดต่อเรา</h1>
            <p>เรียน คุณ${name}</p>
            <p>ขอบคุณที่ติดต่อมายังสำนักงานเครือข่ายองค์กรงดเหล้า เราได้รับข้อความของท่านเรียบร้อยแล้ว</p>

            <h3>รายละเอียดข้อความของท่าน:</h3>
            <ul>
              <li><strong>หัวข้อ:</strong> ${subject}</li>
              <li><strong>วันที่ส่ง:</strong> ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
            </ul>

            <p>ทีมงานของเราจะตรวจสอบข้อความและติดต่อกลับไปที่ ${phone ? `เบอร์โทรศัพท์ ${phone} หรือ` : ''} อีเมล ${email} ในเร็วๆ นี้</p>

            <p>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่:</p>
            <ul>
              <li>อีเมล: <a href="mailto:contact@sdnthailand.com">contact@sdnthailand.com</a></li>
              <li>โทรศัพท์: 02-948-3300</li>
            </ul>
          </div>
          <div class="footer">
            <p>สำนักงานเครือข่ายองค์กรงดเหล้า (สคล.) มุ่งมั่นส่งเสริมและสนับสนุนการดำเนินงานในทุกภาคส่วนของสังคม เพื่อลดผลกระทบและความเสี่ยงจากการบริโภคเครื่องดื่มแอลกอฮอล์ ร่วมสร้างสรรค์สังคมไทยให้เข้มแข็งและปลอดภัยอย่างยั่งยืน</p>
            <p>© 2024 SDN Thailand. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin team and contact@sdnthailand.com
    const attachments: any[] = [
      {
        filename: 'logo.png',
        path: path.join(process.cwd(), 'public', 'logo.png'),
        cid: 'logo'
      }
    ];

    // Add user uploaded file if exists
    if (filePath && file) {
      attachments.push({
        filename: file.name,
        path: path.join(process.cwd(), 'public', filePath)
      });
    }

    await transporter.sendMail({
      from: '"SDN Thailand" <sdnthailandbackup@gmail.com>',
      to: "contact@sdnthailand.com, evo_reaction@hotmail.com ,tom_teera@hotmail.com, tan66847@gmail.com",
      subject: `ข้อความติดต่อจากเว็บไซต์: ${subject}`,
      html: adminEmailHtml,
      replyTo: email,
      attachments: attachments
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: '"SDN Thailand" <sdnthailandbackup@gmail.com>',
      to: email,
      subject: "ยืนยันการรับข้อความจาก SDN Thailand",
      html: userEmailHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'logo.png'),
          cid: 'logo'
        }
      ]
    });

    return NextResponse.json({
      message: 'ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      error: 'ไม่สามารถส่งข้อความได้ โปรดลองอีกครั้งหรือติดต่อเราทางโทรศัพท์'
    }, { status: 500 });
  }
}
