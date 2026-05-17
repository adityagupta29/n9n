/**
 * n9n Node: Post to X
 * Category: integration
 * Description: Post to X (Twitter)
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'post-to-x',
  category: 'integration',
  name: 'Post to X',
  color: '#000000',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
  config: { 
    text: '{{data}}' 
  },
  suggests: [],
  
  documentation: {
    description: 'Opens X (Twitter) compose window with pre-filled text.',
    input: 'Text to post',
    output: 'Twitter intent URL',
    example: 'Input: "Hello World" → Opens X with "Hello World" ready to post'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Text Template</label>
        <textarea rows="4" onchange="n9n.updateConfig('${node.id}', 'text', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="{{data}}">${node.config.text || ''}</textarea>
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Keep under 280 characters</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const text = encodeURIComponent(n9n.renderTemplate(node.config.text, inputData));
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    n9n.addLog(`Opening X...`, 'info');
    window.open(url, '_blank');
    return url;
  }
});
