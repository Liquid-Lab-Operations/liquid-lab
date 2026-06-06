/**
 * Parser — Convert raw conversations to structured markdown
 * Handles: Chat transcripts, Code sessions, Cowork notes
 */

const fs = require('fs');
const yaml = require('yaml');
const { v4: uuidv4 } = require('uuid');

class ConversationParser {
  constructor() {
    this.conversationId = uuidv4();
    this.date = new Date().toISOString().split('T')[0];
  }

  /**
   * Parse raw conversation into structured markdown
   */
  parse(rawText, source = 'manual', options = {}) {
    const {
      title = 'Untitled Conversation',
      participants = ['pivo'],
      tags = []
    } = options;

    // Extract topics from content
    const topics = this.extractTopics(rawText);
    const decisions = this.extractDecisions(rawText);
    const actions = this.extractActions(rawText);
    const insights = this.extractInsights(rawText);

    // Generate frontmatter
    const frontmatter = {
      title,
      data: this.date,
      tipo: 'conversacao',
      fonte: source,
      tags: ['conversacao', ...tags],
      status: 'documentado',
      participants,
      topics,
      'knowledge-capture': true,
      'graphify-analysis': `graph-${this.date}`,
      conversationId: this.conversationId
    };

    // Build markdown
    const markdown = this.buildMarkdown(
      frontmatter,
      rawText,
      decisions,
      actions,
      insights,
      topics
    );

    return {
      id: this.conversationId,
      title,
      date: this.date,
      markdown,
      metadata: {
        source,
        participants,
        topics,
        decisions,
        actions,
        insights
      }
    };
  }

  /**
   * Extract topics/keywords
   */
  extractTopics(text) {
    const keywords = new Set();
    const patterns = [
      /(?:implementar|criar|build)\s+([a-zA-Z\s]+)/gi,
      /(?:usar|integrar)\s+([a-zA-Z\s]+)/gi,
      /(?:problema|issue|error)\s*:\s*([^.]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          keywords.add(match[1].trim().toLowerCase());
        }
      }
    });

    return Array.from(keywords).slice(0, 5);
  }

  /**
   * Extract decisions made
   */
  extractDecisions(text) {
    const decisions = [];
    const patterns = [
      /decidimos?\s+(?:que\s+)?([^.!?]+)/gi,
      /vamos\s+([^.!?]+)/gi,
      /é melhor\s+([^.!?]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && match[1].length > 10) {
          decisions.push({
            text: match[1].trim(),
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return decisions.slice(0, 5);
  }

  /**
   * Extract action items
   */
  extractActions(text) {
    const actions = [];
    const patterns = [
      /(?:precisa|need to|TODO|FIXME)\s*[:-]\s*([^.!?]+)/gi,
      /(\[[✓x\s]\].*)/gi,
      /(?:vou|vai|vamos)\s+([^.!?]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          actions.push({
            text: match[1].trim(),
            completed: match[0].includes('✓') || false
          });
        }
      }
    });

    return actions.slice(0, 5);
  }

  /**
   * Extract insights
   */
  extractInsights(text) {
    const insights = [];
    const patterns = [
      /(?:descobri|realized|found)\s+(?:que\s+)?([^.!?]+)/gi,
      /(?:importante|key|critical)\s*:\s*([^.!?]+)/gi,
      /(?:padrão|pattern|tendência)\s+([^.!?]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          insights.push(match[1].trim());
        }
      }
    });

    return insights.slice(0, 5);
  }

  /**
   * Build complete markdown document
   */
  buildMarkdown(frontmatter, content, decisions, actions, insights, topics) {
    let md = '---\n';
    md += yaml.stringify(frontmatter);
    md += '---\n\n';

    md += `# ${frontmatter.title} 💬\n\n`;
    md += `**Data:** ${frontmatter.data}\n`;
    md += `**Fonte:** ${frontmatter.fonte}\n`;
    md += `**Participantes:** ${frontmatter.participants.join(', ')}\n\n`;

    if (topics.length > 0) {
      md += `## Tópicos\n\n`;
      topics.forEach(t => md += `- [[${t}]]\n`);
      md += '\n';
    }

    if (decisions.length > 0) {
      md += `## Decisões Tomadas\n\n`;
      decisions.forEach(d => md += `- ${d.text}\n`);
      md += '\n';
    }

    if (actions.length > 0) {
      md += `## Ações Necessárias\n\n`;
      actions.forEach(a => {
        const checkbox = a.completed ? '[x]' : '[ ]';
        md += `- ${checkbox} ${a.text}\n`;
      });
      md += '\n';
    }

    if (insights.length > 0) {
      md += `## Insights Extraídos\n\n`;
      insights.forEach(i => md += `- ${i}\n`);
      md += '\n';
    }

    md += `## Conteúdo Original\n\n`;
    md += '```\n' + content + '\n```\n\n';

    md += `---\n\n`;
    md += `**Capturado em:** ${new Date().toISOString()}\n`;
    md += `**ID:** ${frontmatter.conversationId}\n`;
    md += `**Status:** Pronto para Graphify\n`;
    md += `[[graphify-${frontmatter.data}]] — Ver análise de conhecimento\n`;

    return md;
  }
}

module.exports = ConversationParser;
