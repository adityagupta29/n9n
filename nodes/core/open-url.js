/**
 * n9n Node: Open URL
 * Category: action
 * Description: Open a URL in new tab
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'open-url',
  category: 'action',
  name: 'Open URL',
  color: '#3b82f6',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />`,
  config: { 
    baseUrl: 'https://google.com/search?q={{data}}' 
  },
  suggests: [],
  
  documentation: {
    description: 'Opens a URL in a new browser tab. Supports template variables.',
    input: 'Any data (used in template)',
    output: 'The constructed URL string',
    example: 'URL: https://google.com/search?q={{data}} with input "cats" → opens google search for cats'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">URL Template</label>
        <input type="text" value="${node.config.baseUrl || ''}" onchange="n9n.updateConfig('${node.id}', 'baseUrl', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="https://google.com/search?q={{data}}">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Use {{data}} to insert input value</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const url = n9n.renderTemplate(node.config.baseUrl, inputData);
    n9n.addLog(`Opening ${url}`, 'info');
    window.open(url, '_blank');
    return url;
  }
});
