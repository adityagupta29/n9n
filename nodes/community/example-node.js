/**
 * n9n Node: Example Community Node
 * Category: community
 * Description: A simple example node that converts text to uppercase - for learning purposes
 * Author: n9n
 * Version: 1.0.0
 * Community Node: true
 */

n9n.registerNode({
  id: 'example-uppercase',
  category: 'community',
  name: 'Example: Uppercase',
  color: '#ec4899',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"/>`,
  config: {
    prefix: 'RESULT: '
  },
  suggests: [],
  githubUsername: 'n9n',
  
  documentation: {
    description: 'Converts input text to UPPERCASE. This is an example community node for learning.',
    input: 'String to convert',
    output: 'Uppercase string with optional prefix',
    example: 'Input: "hello world" → Output: "RESULT: HELLO WORLD"'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Prefix</label>
        <input type="text" value="${node.config.prefix || ''}" onchange="n9n.updateConfig('${node.id}', 'prefix', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="Prefix before uppercase text">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">This text will be added before the uppercase result</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    // Get input as string
    const text = String(inputData || '');
    
    // Convert to uppercase
    const upperText = text.toUpperCase();
    
    // Add prefix from config
    const result = (node.config.prefix || '') + upperText;
    
    // Log the action
    n9n.addLog(`Converted "${text.substring(0, 20)}..." to uppercase`, 'success');
    
    return result;
  }
});
