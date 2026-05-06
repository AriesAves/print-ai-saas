import Anthropic from '@anthropic-ai/sdk';
import { AnalyzedIssue, IssueCategoryType, SeverityLevel } from '../types/index';

export class IssueNotesAnalyzer {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async analyzeIssue(issueId: string, notes: string): Promise<AnalyzedIssue> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an expert in printing operations and quality control. Analyze the following printing issue notes and provide structured analysis.

Issue Notes:
${notes}

Provide your response in JSON format with these exact fields:
{
  "category": "one of: color_management, material_selection, quality_control, timing, cost_optimization, equipment, workflow",
  "severity": "one of: low, medium, high",
  "problems": ["list of identified problems"],
  "suggestedActions": ["list of specific recommended actions"],
  "analysis": "brief overall analysis summary"
}

Ensure the response is valid JSON only, no markdown formatting.`
          }
        ]
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      const parsedResponse = JSON.parse(responseText);

      return {
        issueId,
        category: parsedResponse.category as IssueCategoryType,
        severity: parsedResponse.severity as SeverityLevel,
        problems: parsedResponse.problems,
        suggestedActions: parsedResponse.suggestedActions,
        analysis: parsedResponse.analysis
      };
    } catch (error) {
      console.error('Error analyzing issue:', error);
      // Fallback analysis
      return this.getFallbackAnalysis(issueId, notes);
    }
  }

  private getFallbackAnalysis(issueId: string, notes: string): AnalyzedIssue {
    const notesLower = notes.toLowerCase();

    let category: IssueCategoryType = 'quality_control';
    if (notesLower.includes('color')) category = 'color_management';
    else if (notesLower.includes('paper') || notesLower.includes('material')) category = 'material_selection';
    else if (notesLower.includes('time') || notesLower.includes('delay')) category = 'timing';
    else if (notesLower.includes('cost') || notesLower.includes('price')) category = 'cost_optimization';
    else if (notesLower.includes('equipment') || notesLower.includes('machine')) category = 'equipment';
    else if (notesLower.includes('process') || notesLower.includes('workflow')) category = 'workflow';

    const severity: SeverityLevel = notesLower.includes('urgent') || notesLower.includes('critical') ? 'high' : 'medium';

    return {
      issueId,
      category,
      severity,
      problems: ['Issue detected in printing operations'],
      suggestedActions: ['Review the issue details', 'Conduct a quality assessment', 'Implement corrective measures'],
      analysis: 'Fallback analysis due to API unavailability'
    };
  }
}
