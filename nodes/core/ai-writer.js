/**
 * n9n Node: AI Writer
 * Category: ai
 * Description: Write structured content with AI
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'ai-writer',
  category: 'ai',
  name: 'AI Writer',
  color: '#8b5cf6',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>`,
  config: { 
    prompt: 'Write a blog post about {{data}}. \nIMPORTANT: Return the result strictly as a JSON object with the following structure: \n{ "title": "The Post Title", "body": "The content here using Markdown for headings..." }', 
    apiKey: '', 
    model: 'openai/gpt-4o' 
  },
  suggests: ['text-formatter', 'post-wordpress'],
  
  documentation: {
    description: 'Writes structured content using AI. Designed to output JSON for blog posts, articles, etc.',
    input: 'Any data (used as {{data}} in prompt template)',
    output: 'JSON object with title and body fields, or text if JSON parsing fails',
    example: 'Input: "AI Technology" → Output: {"title": "AI Tech Post", "body": "# AI Technology..."}'
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
        <textarea rows="8" onkeydown="n9n.checkPromptShortcut(event, '${node.id}')" onchange="n9n.updateConfig('${node.id}', 'prompt', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">${node.config.prompt || ''}</textarea>
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Use {{data}} to insert input. Request JSON for structured output.</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const key = node.config.apiKey || n9n.userSettings.apiKey;
    if (!key) throw new Error("Missing API Key. Add in Settings or Node.");
    
    const prompt = n9n.renderTemplate(node.config.prompt, inputData);
    n9n.addLog(`AI Writer writing...`, 'info');
    
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
