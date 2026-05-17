/**
 * n9n Node: Loop JSON
 * Category: logic
 * Description: Loop through array of JSON objects
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'loop-json',
  category: 'logic',
  name: 'Loop JSON',
  color: '#a855f7',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>`,
  config: { 
    delay: 1000 
  },
  suggests: ['draft-email', 'ai-writer'],
  
  documentation: {
    description: 'Loops through an array of JSON objects and processes each one.',
    input: 'Array of objects',
    output: 'Passes each object to the next node one at a time',
    example: 'Input: [{"name":"John"}, {"name":"Jane"}] → 1st: {name:"John"}, 2nd: {name:"Jane"}'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Delay (ms)</label>
        <input type="number" value="${node.config.delay || 1000}" onchange="n9n.updateConfig('${node.id}', 'delay', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Delay between each iteration in milliseconds</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    // Loop logic is handled by the execution engine
    return inputData;
  }
});
