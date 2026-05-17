/**
 * n9n Node: Split Text
 * Category: logic
 * Description: Split text by a delimiter
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'split-text',
  category: 'logic',
  name: 'Split Text',
  color: '#a855f7',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />`,
  config: { 
    delimiter: ',' 
  },
  suggests: ['loop-items'],
  
  documentation: {
    description: 'Splits text into an array using a delimiter.',
    input: 'Single text string',
    output: 'Array of strings',
    example: 'Input: "Apple, Banana, Cherry" with delimiter "," → ["Apple", "Banana", "Cherry"]'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Delimiter</label>
        <input type="text" value="${node.config.delimiter || ','}" onchange="n9n.updateConfig('${node.id}', 'delimiter', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder=", or \\n or |">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Use \\n for newline, | for pipe separator</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const txt = inputData || "";
    return txt.split(node.config.delimiter || ',').map(s => s.trim()).filter(s => s);
  }
});
