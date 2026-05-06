import { AnalyzedIssue, EmailRecommendation } from '../types/index';

export class EmailRecommendationGenerator {
  generateEmail(
    clientEmail: string,
    clientName: string,
    issueTitle: string,
    analysis: AnalyzedIssue,
    fromEmail: string,
    fromName: string
  ): EmailRecommendation {
    const severityColor = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#dc3545'
    };

    const categoryLabel = {
      color_management: '🎨 Color Management',
      material_selection: '📄 Material Selection',
      quality_control: '✓ Quality Control',
      timing: '⏱️ Timing',
      cost_optimization: '💰 Cost Optimization',
      equipment: '⚙️ Equipment',
      workflow: '🔄 Workflow'
    };

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .severity-badge { display: inline-block; background-color: ${severityColor[analysis.severity]}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
        .section { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #2c3e50; }
        .section h3 { margin-top: 0; color: #2c3e50; }
        .action-item { margin: 10px 0; padding: 10px; background-color: white; border-left: 3px solid #2c3e50; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🖨️ Printing Project Recommendation</h1>
            <p>AI-Generated Analysis & Recommendations</p>
        </div>

        <p>Dear ${clientName},</p>
        <p>We have analyzed the printing issue you reported and prepared the following recommendations:</p>

        <div class="section">
            <h3>Issue Summary</h3>
            <p><strong>Title:</strong> ${issueTitle}</p>
            <p><strong>Category:</strong> ${categoryLabel[analysis.category]}</p>
            <p><strong>Severity:</strong> <span class="severity-badge">${analysis.severity.toUpperCase()}</span></p>
            <p><strong>Analysis:</strong> ${analysis.analysis}</p>
        </div>

        <div class="section">
            <h3>Identified Problems</h3>
            <ul>
                ${analysis.problems.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>

        <div class="section">
            <h3>Recommended Actions</h3>
            ${analysis.suggestedActions.map((action, i) => `
                <div class="action-item">
                    <strong>Step ${i + 1}:</strong> ${action}
                </div>
            `).join('')}
        </div>

        <p>If you have any questions about these recommendations or need further assistance, please don't hesitate to reach out.</p>

        <p>Best regards,<br>The Printing AI Assistant Team</p>

        <div class="footer">
            <p>This recommendation was generated using AI analysis of your issue description.</p>
            <p>© 2026 Print AI SaaS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const textContent = `
PRINTING PROJECT RECOMMENDATION
================================

Dear ${clientName},

We have analyzed the printing issue you reported and prepared the following recommendations:

ISSUE SUMMARY
${'-'.repeat(40)}
Title: ${issueTitle}
Category: ${categoryLabel[analysis.category]}
Severity: ${analysis.severity.toUpperCase()}
Analysis: ${analysis.analysis}

IDENTIFIED PROBLEMS
${'-'.repeat(40)}
${analysis.problems.map(p => `• ${p}`).join('\n')}

RECOMMENDED ACTIONS
${'-'.repeat(40)}
${analysis.suggestedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

If you have any questions or need further assistance, please contact us.

Best regards,
The Printing AI Assistant Team

© 2026 Print AI SaaS. All rights reserved.
    `;

    return {
      to: clientEmail,
      subject: `Printing Issue Analysis: ${issueTitle}`,
      html: htmlContent,
      text: textContent,
      from: fromEmail
    };
  }
}
