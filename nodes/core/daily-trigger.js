/**
 * n9n Node: Daily Trigger
 * Category: trigger
 * Description: Schedule workflow to run daily
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'daily-trigger',
  category: 'trigger',
  name: 'Daily Trigger',
  color: '#10b981',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  config: { 
    interval: 'daily',
    time: '09:00'
  },
  suggests: ['ask-ai'],
  
  documentation: {
    description: 'Schedules your workflow to run automatically every day at a specified time.',
    input: 'None',
    output: 'Simple string "Triggered" with timestamp',
    example: 'Set to 09:00 to run every morning at 9 AM'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Run Time</label>
        <input type="time" value="${node.config.time || '09:00'}" onchange="n9n.updateConfig('${node.id}', 'time', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
      </div>
    `;
  },

  execute: async (node, inputData) => {
    return "Triggered at " + new Date().toLocaleString();
  }
});
