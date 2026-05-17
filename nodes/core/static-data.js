/**
 * n9n Node: Static Data
 * Category: trigger
 * Description: Provide static data as input to your workflow
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'static-data',
  category: 'trigger',
  name: 'Static Data',
  color: '#10b981',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
  config: { 
    data: 'Apple, Banana, Orange', 
    type: 'csv' 
  },
  suggests: ['loop-items', 'split-text'],
  
  documentation: {
    description: 'Provides static data that you define. Can output as CSV array, JSON objects, or plain text.',
    input: 'User defined text in configuration',
    output: 'Depends on type: CSV -> Array of Strings, JSON -> Array of Objects, Text -> Single String',
    example: 'CSV: "Apple, Banana" → ["Apple", "Banana"] | JSON: "[{\"name\":\"John\"}]" → [{name:"John"}]'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Data Type</label>
        <select onchange="n9n.updateConfig('${node.id}', 'type', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
          <option value="csv" ${node.config.type==='csv'?'selected':''}>CSV (Comma Separated)</option>
          <option value="json" ${node.config.type==='json'?'selected':''}>JSON Array</option>
          <option value="text" ${node.config.type==='text'?'selected':''}>Plain Text</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Data</label>
        <textarea rows="4" onchange="n9n.updateConfig('${node.id}', 'data', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">${node.config.data || ''}</textarea>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    if (node.config.type === 'csv') {
      return node.config.data.split(',').map(s => s.trim());
    }
    if (node.config.type === 'json') {
      try { 
        return JSON.parse(node.config.data); 
      } catch(e) { 
        throw new Error("Invalid JSON in Static Data"); 
      }
    }
    return node.config.data;
  }
});
