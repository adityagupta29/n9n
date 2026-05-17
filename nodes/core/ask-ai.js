/**
 * n9n Node: Ask AI
 * Category: ai
 * Description: Ask AI a question and get a response
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'ask-ai',
  category: 'ai',
  name: 'Ask AI',
  color: '#8b5cf6',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>`,
  config: { 
    prompt: 'Give me 3 popular tech news topics separated by commas.', 
    apiKey: '', 
    model: 'openai/gpt-3.5-turbo' 
  },
  suggests: ['loop-items', 'split-text'],
  
  documentation: {
    description: 'Sends a prompt to AI and returns the response. Can use {{data}} to reference input.',
    input: 'Any data (optional, for template variables)',
    output: 'AI response text or parsed JSON if response contains JSON',
    example: 'Prompt: "Summarize this: {{data}}" will replace {{data}} with input'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">API Key</label>
        <input type="password" value="${node.config.apiKey || n9n.userSettings.apiKey || ''}" onchange="n9n.updateConfig('${node.id}', 'apiKey', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="sk-or...">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Model</label>
        <select onchange="n9n.updateConfig('${node.id}', 'model', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
          ${n9n.getModelsOptions(node.config.model)}
        </select>
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Prompt</label>
        <textarea rows="6" onkeydown="n9n.checkPromptShortcut(event, '${node.id}')" onchange="n9n.updateConfig('${node.id}', 'prompt', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">${node.config.prompt || ''}</textarea>
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Tip: Type a shortcut (e.g., /intro) and press Space.</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const key = node.config.apiKey || n9n.userSettings.apiKey;
    if (!key) throw new Error("Missing API Key. Add in Settings or Node.");
    
    const prompt = n9n.renderTemplate(node.config.prompt, inputData);
    n9n.addLog(`Asking AI (${node.config.model})...`, 'info');
    
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${key}` 
      },
      body: JSON.stringify({ 
        model: node.config.model, 
        messages: [{ role: "user", content: prompt }] 
      })
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices[0].message.content;
    
    const json = n9n.extractJsonFromText(text);
    if (json) return json;
    return text;
  }
});
