import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(private config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get('SMTP_HOST'),
      port: parseInt(this.config.get('SMTP_PORT') ?? '587', 10),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendResetPassword(to: string, resetUrl: string) {
    const info = await this.transporter.sendMail({
      from: this.config.get('SMTP_USER'),
      to,
      subject: 'Sponti - Password Reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    return info;
  }
}
