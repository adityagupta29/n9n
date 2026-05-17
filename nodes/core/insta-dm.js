/**
 * n9n Node: Instagram DM
 * Category: integration
 * Description: Open Instagram DM with copied message
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'insta-dm',
  category: 'integration',
  name: 'Instagram DM',
  color: '#E1306C',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`,
  config: { 
    usernameKey: 'username', 
    textKey: 'text' 
  },
  suggests: [],
  
  documentation: {
    description: 'Opens Instagram DM thread and copies message to clipboard. You paste and send.',
    input: 'Object with {username, text} fields',
    output: 'Opens DM thread',
    example: 'Input: {"username":"john_doe", "text":"Hello!"} → Opens ig.me/u/john_doe'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Username Key</label>
        <input type="text" value="${node.config.usernameKey || 'username'}" onchange="n9n.updateConfig('${node.id}', 'usernameKey', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="username">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">JSON key containing Instagram username</p>
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Message Key</label>
        <input type="text" value="${node.config.textKey || 'text'}" onchange="n9n.updateConfig('${node.id}', 'textKey', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="text">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">JSON key containing message text</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    if(typeof inputData !== 'object') throw new Error("Input must be JSON");
    const username = inputData[node.config.usernameKey];
    const text = inputData[node.config.textKey];
    if(!username) throw new Error("Username key not found in data");
    
    await navigator.clipboard.writeText(text);
    n9n.addLog(`Copied DM text to clipboard for ${username}`, 'info');
    
    const url = `https://ig.me/u/${username}`;
    window.open(url, '_blank');
    return `Opened DM for ${username}`;
  }
});
