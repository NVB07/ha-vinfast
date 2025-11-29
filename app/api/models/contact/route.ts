import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, address, message, carName, carId } = body;

        // Validate required fields
        if (!name || !phone || !address || !message) {
            return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
        }

        // Get email configuration from environment variables
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = parseInt(process.env.SMTP_PORT || "587");
        const smtpUser = process.env.SMTP_USER;
        const smtpPassword = process.env.SMTP_PASSWORD;
        const smtpFrom = process.env.SMTP_FROM || smtpUser;
        const smtpTo = process.env.SMTP_TO || smtpUser;

        if (!smtpHost || !smtpUser || !smtpPassword) {
            console.error("SMTP configuration is missing");
            return NextResponse.json({ error: "Cấu hình email chưa được thiết lập" }, { status: 500 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
        });

        // Email content
        const mailOptions = {
            from: `"VinFast Contact Form" <${smtpFrom}>`,
            to: smtpTo,
            subject: `Quan tâm đến ${carName || "xe VinFast"}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Thông tin quan tâm xe mới</h2>
                    ${
                        carName
                            ? `<div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                        <p style="margin: 0;"><strong>Xe quan tâm:</strong> ${carName}</p>
                        ${carId ? `<p style="margin: 5px 0 0 0;"><strong>Mã xe:</strong> ${carId}</p>` : ""}
                    </div>`
                            : ""
                    }
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Họ và tên:</strong> ${name}</p>
                        <p><strong>Số điện thoại:</strong> ${phone}</p>
                        <p><strong>Địa chỉ:</strong> ${address}</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h3 style="color: #1f2937; margin-top: 0;">Tin nhắn:</h3>
                        <p style="color: #4b5563; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                        Email này được gửi tự động từ form quan tâm xe trên website VinFast.
                    </p>
                </div>
            `,
            text: `
Thông tin quan tâm xe mới

${carName ? `Xe quan tâm: ${carName}${carId ? `\nMã xe: ${carId}` : ""}\n` : ""}
Họ và tên: ${name}
Số điện thoại: ${phone}
Địa chỉ: ${address}

Tin nhắn:
${message}
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email đã được gửi thành công" });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: error.message || "Có lỗi xảy ra khi gửi email" }, { status: 500 });
    }
}
