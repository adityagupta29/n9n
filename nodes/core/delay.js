/**
 * n9n Node: Delay
 * Category: logic
 * Description: Add a delay/wait between nodes
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'delay',
  category: 'logic',
  name: 'Wait/Delay',
  color: '#a855f7',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  config: { 
    time: 5000 
  },
  suggests: [],
  
  documentation: {
    description: 'Pauses execution for a specified amount of time.',
    input: 'Any data',
    output: 'Same data passed through unchanged',
    example: 'Set 5000ms to wait 5 seconds before continuing'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Wait Time (ms)</label>
        <input type="number" value="${node.config.time || 5000}" onchange="n9n.updateConfig('${node.id}', 'time', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">1000ms = 1 second</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    n9n.addLog(`Waiting ${node.config.time}ms...`, 'info');
    await new Promise(r => setTimeout(r, node.config.time));
    return inputData || "Waited";
  }
});
