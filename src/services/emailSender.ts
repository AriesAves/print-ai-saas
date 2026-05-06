import nodemailer from 'nodemailer';
import { EmailRecommendation, AssistantConfig } from '../types/index';

export class EmailSender {
  private transporter: nodemailer.Transporter;
  private fromName: string;

  constructor(config: AssistantConfig) {
    this.fromName = config.fromName;
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }

  async sendEmail(recommendation: EmailRecommendation): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `${this.fromName} <${recommendation.from}>`,
        to: recommendation.to,
        subject: recommendation.subject,
        text: recommendation.text,
        html: recommendation.html
      });
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${recommendation.to}:`, error);
      return false;
    }
  }

  async sendBulkEmails(recommendations: EmailRecommendation[]): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    for (const recommendation of recommendations) {
      const result = await this.sendEmail(recommendation);
      if (result) {
        successful++;
      } else {
        failed++;
      }
    }

    return { successful, failed };
  }
}
