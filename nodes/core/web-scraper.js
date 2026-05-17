/**
 * n9n Node: Web Scraper
 * Category: action
 * Description: Scrape data from websites using CSS selectors
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'web-scraper',
  category: 'action',
  name: 'Web Scraper',
  color: '#3b82f6',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>`,
  config: { 
    url: 'https://news.ycombinator.com/', 
    selector: '.titleline > a' 
  },
  suggests: ['loop-items', 'ai-writer'],
  
  documentation: {
    description: 'Scrapes website content using CSS selectors. Useful for extracting headlines, links, or any page element.',
    input: 'None (uses URL from config)',
    output: 'Array of strings (text content found)',
    example: 'Scrape Hacker News: URL=news.ycombinator.com, Selector=.titleline > a'
  },

  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Website URL</label>
        <input type="text" value="${node.config.url || ''}" onchange="n9n.updateConfig('${node.id}', 'url', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="https://...">
      </div>
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">CSS Selector</label>
        <input type="text" value="${node.config.selector || ''}" onchange="n9n.updateConfig('${node.id}', 'selector', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder=".class, h2, #id">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Right-click on any element → Inspect → Copy selector</p>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    const proxy = 'https://api.allorigins.win/raw?url=';
    n9n.addLog(`Scraping ${node.config.url}...`, 'info');
    
    try {
      const res = await fetch(proxy + encodeURIComponent(node.config.url));
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const elements = doc.querySelectorAll(node.config.selector);
      const results = [];
      elements.forEach(el => results.push(el.innerText));
      n9n.addLog(`Found ${results.length} elements.`, 'success');
      return results;
    } catch(e) { 
      throw new Error("Network error or blocked by CORS proxy"); 
    }
  }
});
