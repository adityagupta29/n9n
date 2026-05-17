/**
 * n9n Node: WordPress Draft
 * Category: integration
 * Description: Create WordPress draft post
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'post-wordpress',
  category: 'integration',
  name: 'WordPress Draft',
  color: '#21759b',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`,
  config: { 
    siteUrl: 'https://yoursite.com' 
  },
  suggests: [],
  
  documentation: {
    description: 'Opens WordPress editor with a pre-filled draft post.',
    input: 'Object with {title, body} fields',
    output: '{title, bodyLength} of created draft',
    example: 'Input: {"title":"My Post", "body":"# Hello"} → Opens WP with draft'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Your WordPress URL</label>
        <input type="text" value="${node.config.siteUrl || ''}" onchange="n9n.updateConfig('${node.id}', 'siteUrl', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="https://yoursite.com">
      </div>
    `;
  },

  execute: async (node, inputData) => {
    if (typeof inputData !== 'object' || inputData === null || Array.isArray(inputData)) {
      throw new Error("Input must be a JSON object: { title: '...', body: '...' }");
    }
    if (!inputData.title || !inputData.body) {
      throw new Error("JSON object must contain 'title' and 'body' keys.");
    }

    const title = inputData.title;
    let body = inputData.body;

    if (typeof marked !== 'undefined') {
      body = marked.parse(body);
    }

    const encodedTitle = encodeURIComponent(title);
    const encodedContent = encodeURIComponent(body);
    const url = `${node.config.siteUrl}/wp-admin/post-new.php?post_title=${encodedTitle}&content=${encodedContent}`;
    
    n9n.addLog(`Opening WP: ${title}`, 'info');
    window.open(url, '_blank');
    return { title, bodyLength: body.length };
  }
});
