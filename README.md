# 🖨️ AI Email Assistant for Printing Projects

An intelligent AI-powered email assistant that analyzes printing project issues from notes and provides professional recommendations via email.

## ✨ Features

- **AI-Powered Analysis**: Uses Claude 3.5 Sonnet to analyze printing issues
- **7 Issue Categories**: Color management, material selection, quality control, timing, cost optimization, equipment, workflow
- **Severity Assessment**: Automatically categorizes issues as low, medium, or high severity
- **Professional Emails**: Generates beautifully formatted HTML and plain text emails
- **Bulk Processing**: Handle multiple issues efficiently
- **SMTP Integration**: Works with Gmail, Office 365, and custom SMTP servers
- **Error Handling**: Graceful fallbacks if AI analysis fails

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key (get from [console.anthropic.com](https://console.anthropic.com))
- SMTP credentials (Gmail, Office 365, or custom server)

### Installation

```bash
# Clone or navigate to the repository
cd print-ai-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and SMTP settings
```

### Usage

#### Single Issue Processing

```typescript
import { PrintingAssistantOrchestrator } from './src/index';

const assistant = PrintingAssistantOrchestrator.createFromEnv();

const issue = {
  id: 'issue-1',
  title: 'Color Mismatch in Batch Print',
  notes: 'Customer reported color deviation in blue inks...',
  createdAt: new Date()
};

await assistant.processSingleIssue(
  issue,
  'client@example.com',
  'John Client'
);
```

#### Bulk Processing

```typescript
const issues = [
  {
    issue: { /* ... */ },
    clientEmail: 'client1@example.com',
    clientName: 'Client 1'
  },
  {
    issue: { /* ... */ },
    clientEmail: 'client2@example.com',
    clientName: 'Client 2'
  }
];

const results = await assistant.processBulkIssues(issues);
console.log(`Sent ${results.successful} emails successfully`);
```

#### Run Example

```bash
npm run example
```

## 🏗️ Architecture

### Services

1. **IssueNotesAnalyzer**
   - Analyzes free-form issue notes using Claude AI
   - Extracts category, severity, problems, and suggested actions
   - Provides fallback analysis if API fails

2. **EmailRecommendationGenerator**
   - Creates professional HTML and plain text emails
   - Includes color-coded severity badges
   - Formats analysis results for readability

3. **EmailSender**
   - Handles SMTP email delivery
   - Supports single and bulk sending
   - Connection verification

4. **PrintingAssistantOrchestrator**
   - Coordinates the entire workflow
   - Factory method for environment-based initialization
   - Error handling and logging

## 📋 Issue Categories

- **Color Management**: Color mismatches, calibration issues
- **Material Selection**: Paper quality, substrate issues
- **Quality Control**: Print defects, finishing problems
- **Timing**: Production delays, workflow bottlenecks
- **Cost Optimization**: Pricing, material costs, efficiency
- **Equipment**: Machine issues, maintenance
- **Workflow**: Process improvements, operational changes

## 🔧 Configuration

### Environment Variables

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Configuration
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Printing Assistant
```

### Gmail Setup

1. Enable 2-factor authentication
2. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the App Password in `.env`

## 📦 Project Structure

```
print-ai-saas/
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── services/
│   │   ├── issueNotesAnalyzer.ts
│   │   ├── emailRecommendationGenerator.ts
│   │   └── emailSender.ts
│   ├── orchestrator.ts
│   └── index.ts
├── examples/
│   └── basicUsage.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 📝 API Reference

### PrintingAssistantOrchestrator

#### `constructor(config: AssistantConfig)`
Initialize with configuration object.

#### `static createFromEnv(): PrintingAssistantOrchestrator`
Create instance from environment variables.

#### `async processSingleIssue(issue, clientEmail, clientName): Promise<boolean>`
Process a single printing issue and send recommendation email.

#### `async processBulkIssues(issues): Promise<{successful, failed}>`
Process multiple issues and send all recommendation emails.

#### `async verifySetup(): Promise<boolean>`
Verify SMTP connection and system readiness.

## 🧪 Testing

```bash
# Build the project
npm run build

# Run the example
npm run example
```

## 📄 License

MIT

## 🤝 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for the printing industry**
