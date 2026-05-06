import { IssueNotesAnalyzer } from './services/issueNotesAnalyzer';
import { EmailRecommendationGenerator } from './services/emailRecommendationGenerator';
import { EmailSender } from './services/emailSender';
import { PrintingIssue, AssistantConfig, BulkProcessResult, BulkIssueRequest } from './types/index';

export class PrintingAssistantOrchestrator {
  private analyzer: IssueNotesAnalyzer;
  private emailGenerator: EmailRecommendationGenerator;
  private emailSender: EmailSender;
  private config: AssistantConfig;

  constructor(config: AssistantConfig) {
    this.config = config;
    this.analyzer = new IssueNotesAnalyzer(config.anthropicApiKey);
    this.emailGenerator = new EmailRecommendationGenerator();
    this.emailSender = new EmailSender(config);
  }

  static createFromEnv(): PrintingAssistantOrchestrator {
    const config: AssistantConfig = {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587'),
      smtpSecure: process.env.SMTP_SECURE === 'true',
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS || '',
      fromEmail: process.env.FROM_EMAIL || '',
      fromName: process.env.FROM_NAME || 'Printing Assistant'
    };

    if (!config.anthropicApiKey || !config.smtpUser || !config.smtpPass) {
      throw new Error('Missing required environment variables');
    }

    return new PrintingAssistantOrchestrator(config);
  }

  async verifySetup(): Promise<boolean> {
    console.log('Verifying system setup...');
    const smtpConnected = await this.emailSender.verifyConnection();
    if (!smtpConnected) {
      console.error('❌ SMTP connection failed');
      return false;
    }
    console.log('✅ System setup verified');
    return true;
  }

  async processSingleIssue(
    issue: PrintingIssue,
    clientEmail: string,
    clientName: string
  ): Promise<boolean> {
    try {
      console.log(`Processing issue: ${issue.title}`);

      // Analyze the issue
      const analysis = await this.analyzer.analyzeIssue(issue.id, issue.notes);
      console.log(`  Category: ${analysis.category}`);
      console.log(`  Severity: ${analysis.severity}`);

      // Generate email recommendation
      const emailRec = this.emailGenerator.generateEmail(
        clientEmail,
        clientName,
        issue.title,
        analysis,
        this.config.fromEmail,
        this.config.fromName
      );

      // Send email
      const sent = await this.emailSender.sendEmail(emailRec);
      if (sent) {
        console.log(`✅ Email sent to ${clientEmail}`);
      } else {
        console.log(`❌ Failed to send email to ${clientEmail}`);
      }

      return sent;
    } catch (error) {
      console.error(`Error processing issue ${issue.id}:`, error);
      return false;
    }
  }

  async processBulkIssues(requests: BulkIssueRequest[]): Promise<BulkProcessResult> {
    const result: BulkProcessResult = {
      successful: 0,
      failed: 0,
      errors: []
    };

    console.log(`Processing ${requests.length} issues...`);

    for (const request of requests) {
      const success = await this.processSingleIssue(
        request.issue,
        request.clientEmail,
        request.clientName
      );

      if (success) {
        result.successful++;
      } else {
        result.failed++;
        result.errors.push(`Failed to process issue ${request.issue.id}`);
      }
    }

    return result;
  }
}
