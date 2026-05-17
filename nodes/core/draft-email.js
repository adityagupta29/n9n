/**
 * n9n Node: Draft Email
 * Category: integration
 * Description: Open email client with pre-filled draft
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'draft-email',
  category: 'integration',
  name: 'Draft Email (Manual)',
  color: '#f59e0b',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`,
  config: { 
    provider: 'gmail', 
    to: '{{email}}', 
    subject: '{{subject}}', 
    body: 'Hi, {{body}}' 
  },
  suggests: [],
  
  documentation: {
    description: 'Opens your email client with a pre-filled draft. Supports templates.',
    input: 'Object with email, subject, body fields (if using templates)',
    output: '"Draft opened" status',
    example: 'Input: {"email":"john@test.com", "subject":"Hello"} → Opens Gmail with draft'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Provider</label>
        <select onchange="n9n.updateConfig('${node.id}', 'provider', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
          <option value="gmail" ${node.config.provider==='gmail'?'selected':''}>Gmail (Web)</option>
          <option value="default" ${node.config.provider==='default'?'selected':''}>Default App</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">To</label>
        <input type="text" value="${node.config.to || ''}" onchange="n9n.updateConfig('${node.id}', 'to', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{email}}">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Subject</label>
        <input type="text" value="${node.config.subject || ''}" onchange="n9n.updateConfig('${node.id}', 'subject', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="Hi {{name}}">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Body</label>
        <textarea rows="3" onchange="n9n.updateConfig('${node.id}', 'body', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="Hello {{name}}...">${node.config.body || ''}</textarea>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const to = n9n.renderTemplate(node.config.to, inputData);
    const subject = n9n.renderTemplate(node.config.subject, inputData);
    const body = n9n.renderTemplate(node.config.body, inputData);

    let link = '';
    if (node.config.provider === 'gmail') {
      link = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      link = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    n9n.addLog(`Opening Client to: ${to}`, 'info');
    window.open(link, '_blank');
    return "Draft opened";
  }
});
