import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextFormatterService {

  /**
   * Format analysis text into a clean, professional report
   */
  formatAnalysis(rawText: string): string {
    if (!rawText) return '';

    let formatted = rawText;

    // Normalize line breaks
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Format headers
    formatted = this.formatHeaders(formatted);

    // Format bullet points
    formatted = this.formatBulletPoints(formatted);

    // Format bold text
    formatted = this.formatBoldText(formatted);

    // Add spacing between sections
    formatted = this.addSectionSpacing(formatted);

    // Clean up multiple blank lines
    formatted = formatted.replace(/\n{4,}/g, '\n\n\n');

    return formatted.trim();
  }

  /**
   * Format markdown headers into clean text headers
   */
  private formatHeaders(text: string): string {
    // H3 headers (###)
    text = text.replace(/^###\s+(.+)$/gm, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n$1\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // H2 headers (##)
    text = text.replace(/^##\s+(.+)$/gm, '\n════════════════════════════════════\n$1\n════════════════════════════════════');

    // H1 headers (#)
    text = text.replace(/^#\s+(.+)$/gm, '\n╔═══════════════════════════════════╗\n  $1\n╚═══════════════════════════════════╝');

    return text;
  }

  /**
   * Format bullet points consistently
   */
  private formatBulletPoints(text: string): string {
    // Convert various bullet styles to consistent format
    // Level 1: Main bullets
    text = text.replace(/^[\*\-]\s+/gm, '• ');
    text = text.replace(/^\*\*(\d+)\.\s+(.+?):\*\*/gm, '\n$1. $2:');

    // Nested bullets (with indentation)
    text = text.replace(/^\s{2,4}[\*\-]\s+/gm, '  – ');
    text = text.replace(/^\s{5,8}[\*\-]\s+/gm, '    ◦ ');

    return text;
  }

  /**
   * Format bold text (remove markdown asterisks)
   */
  private formatBoldText(text: string): string {
    // Convert **bold** to BOLD (uppercase for emphasis in plain text)
    text = text.replace(/\*\*(.+?)\*\*/g, (match, content) => {
      // Keep score patterns as is
      if (content.match(/score|priority/i)) {
        return content.toUpperCase();
      }
      // Convert section headers to title case with decoration
      if (content.match(/:/)) {
        return `\n▶ ${content}`;
      }
      return content.toUpperCase();
    });

    return text;
  }

  /**
   * Add consistent spacing between sections
   */
  private addSectionSpacing(text: string): string {
    // Add space before major sections
    text = text.replace(/\n(═|━)/g, '\n\n$1');
    text = text.replace(/\n▶/g, '\n\n▶');

    // Add space after lists before new sections
    text = text.replace(/(\n• .+?)(\n\n[A-Z])/g, '$1\n$2');

    return text;
  }

  /**
   * Format comparison/match analysis
   */
  formatComparison(rawText: string): string {
    if (!rawText) return '';

    let formatted = this.formatAnalysis(rawText);

    // Highlight key strengths and gaps
    formatted = formatted.replace(/Key Strengths:/gi, '\n✓ KEY STRENGTHS:');
    formatted = formatted.replace(/Areas for Improvement/gi, '\n✗ AREAS FOR IMPROVEMENT');
    formatted = formatted.replace(/Gaps & Weaknesses/gi, '\n✗ GAPS & WEAKNESSES');
    formatted = formatted.replace(/Recommendations:/gi, '\n⚡ RECOMMENDATIONS:');

    // Format match scores with visual indicators
    formatted = formatted.replace(/(\d+)\/100/g, (match) => {
      const score = parseInt(match);
      let indicator = '';
      if (score >= 80) indicator = '🟢';
      else if (score >= 60) indicator = '🟡';
      else if (score >= 40) indicator = '🟠';
      else indicator = '🔴';
      return `${indicator} ${match}`;
    });

    return formatted;
  }

  /**
   * Format rewritten CV with clear sections
   */
  formatRewrittenCV(rawText: string): string {
    if (!rawText) return '';

    let formatted = this.formatAnalysis(rawText);

    // Highlight CV sections
    const sections = [
      'PROFESSIONAL SUMMARY',
      'TECHNICAL SKILLS',
      'PROFESSIONAL EXPERIENCE',
      'EXPERIENCE',
      'EDUCATION',
      'CERTIFICATIONS',
      'PROJECTS',
      'SKILLS'
    ];

    sections.forEach(section => {
      const regex = new RegExp(`^${section}$`, 'gim');
      formatted = formatted.replace(regex, `\n╔═══════════════════════════════════╗\n  ${section}\n╚═══════════════════════════════════╝\n`);
    });

    // Format job titles and companies
    formatted = formatted.replace(/^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)$/gm, '\n► $1 at $2\n  📅 $3');

    return formatted;
  }

  /**
   * Extract and format score prominently
   */
  extractScore(text: string): { score: number; label: string } | null {
    const scoreMatch = text.match(/(?:Overall\s+(?:ATS|Match|Fit)\s+Score[:\s*]+)(\d+)(?:\/100)?/i);
    if (!scoreMatch) return null;

    const score = parseInt(scoreMatch[1]);
    let label = '';

    if (text.toLowerCase().includes('ats')) {
      if (score >= 80) label = 'Excellent ATS Compatibility';
      else if (score >= 60) label = 'Good ATS Compatibility';
      else if (score >= 40) label = 'Fair ATS Compatibility';
      else label = 'Needs Improvement';
    } else if (text.toLowerCase().includes('match') || text.toLowerCase().includes('fit')) {
      if (score >= 80) label = 'Excellent Match';
      else if (score >= 60) label = 'Good Match';
      else if (score >= 40) label = 'Moderate Match';
      else label = 'Low Match';
    }

    return { score, label };
  }

  /**
   * Create a summary header for the report
   */
  createReportHeader(type: 'analysis' | 'comparison' | 'rewrite', score?: number): string {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let title = '';
    switch (type) {
      case 'analysis':
        title = 'CV ATS ANALYSIS REPORT';
        break;
      case 'comparison':
        title = 'JOB MATCH ANALYSIS REPORT';
        break;
      case 'rewrite':
        title = 'OPTIMIZED CV DOCUMENT';
        break;
    }

    let header = `
╔════════════════════════════════════════════════════════════╗
  ${title}
  Generated: ${timestamp}`;

    if (score !== undefined) {
      header += `\n  Overall Score: ${score}/100`;
    }

    header += `
╚════════════════════════════════════════════════════════════╝
`;

    return header;
  }
}
