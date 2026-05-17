/**
 * n9n Node: Post to LinkedIn
 * Category: integration
 * Description: Post to LinkedIn
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'post-linkedin',
  category: 'integration',
  name: 'Post to LinkedIn',
  color: '#0A66C2',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>`,
  config: { 
    text: '{{data}}' 
  },
  suggests: [],
  
  documentation: {
    description: 'Copies post text to clipboard and opens LinkedIn feed. You paste and post manually.',
    input: 'Text to post',
    output: 'Success message',
    example: 'Input: "Excited to share..." → Copies to clipboard, opens LinkedIn'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Text Template</label>
        <textarea rows="4" onchange="n9n.updateConfig('${node.id}', 'text', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{data}}">${node.config.text || ''}</textarea>
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Text will be copied to clipboard</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const textToCopy = n9n.renderTemplate(node.config.text, inputData);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      n9n.addLog('Copied text to clipboard!', 'success');
    } catch(err) {
      n9n.addLog('Could not copy text.', 'error');
    }

    n9n.addLog(`Opening LinkedIn...`, 'info');
    window.open('https://www.linkedin.com/feed/', '_blank');
    return "Opened LinkedIn. Text copied to clipboard.";
  }
});
