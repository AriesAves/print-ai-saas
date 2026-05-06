/**
 * Type definitions for the Printing AI Assistant
 */

export interface PrintingIssue {
  id: string;
  title: string;
  notes: string;
  createdAt: Date;
}

export interface AnalyzedIssue {
  issueId: string;
  category: IssueCategoryType;
  severity: SeverityLevel;
  problems: string[];
  suggestedActions: string[];
  analysis: string;
}

export type IssueCategoryType =
  | 'color_management'
  | 'material_selection'
  | 'quality_control'
  | 'timing'
  | 'cost_optimization'
  | 'equipment'
  | 'workflow';

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface EmailRecommendation {
  to: string;
  subject: string;
  html: string;
  text: string;
  from: string;
}

export interface AssistantConfig {
  anthropicApiKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
}

export interface BulkProcessResult {
  successful: number;
  failed: number;
  errors: string[];
}

export interface BulkIssueRequest {
  issue: PrintingIssue;
  clientEmail: string;
  clientName: string;
}
