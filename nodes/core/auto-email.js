/**
 * n9n Node: Auto Email
 * Category: integration
 * Description: Send email via webhook/API
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'auto-email',
  category: 'integration',
  name: 'Auto Email (API)',
  color: '#ef4444',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
  config: { 
    webhookUrl: '', 
    to: '{{email}}', 
    subject: '{{subject}}', 
    body: '{{body}}' 
  },
  suggests: [],
  
  documentation: {
    description: 'Sends email automatically via webhook. Requires email service webhook URL (like Zapier, Make, or custom).',
    input: 'Object with email data',
    output: '"Sent" status or error',
    example: 'Requires webhookUrl to be configured. SendGrid, Zapier, or custom endpoint.'
  },

  generateConfigForm: (node) => {
    return `
      <div class="bg-red-900/20 border border-red-500/30 p-2 rounded text-red-400 text-xs mb-2">
        Requires Webhook URL from email service (Zapier, Make, etc.)
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Webhook URL</label>
        <input type="text" value="${node.config.webhookUrl || ''}" onchange="n9n.updateConfig('${node.id}', 'webhookUrl', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">To</label>
        <input type="text" value="${node.config.to || ''}" onchange="n9n.updateConfig('${node.id}', 'to', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{email}}">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Subject</label>
        <input type="text" value="${node.config.subject || ''}" onchange="n9n.updateConfig('${node.id}', 'subject', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{subject}}">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Body</label>
        <textarea rows="3" onchange="n9n.updateConfig('${node.id}', 'body', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{body}}">${node.config.body || ''}</textarea>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    if(!node.config.webhookUrl) throw new Error("Missing Webhook URL");
    
    const payload = {
      to: n9n.renderTemplate(node.config.to, inputData),
      subject: n9n.renderTemplate(node.config.subject, inputData),
      body: n9n.renderTemplate(node.config.body, inputData)
    };

    n9n.addLog(`Sending Auto Email to ${payload.to}...`, 'info');
    const res = await fetch(node.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if(res.ok) return "Sent";
    throw new Error("Webhook failed: " + res.statusText);
  }
});
