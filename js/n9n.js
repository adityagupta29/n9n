/**
 * n9n - The Free n8n Alternative
 * Core Node System - Handles dynamic node registration and execution
 */

window.n9n = {
  // Node registry
  registeredNodes: new Map(),
  
  // User settings
  userSettings: {
    apiKey: '',
    promptShortcuts: []
  },
  
  // Available models for AI nodes
  models: [],
  
  /**
   * Register a new node type
   * This is called by each node file
   */
  registerNode: function(nodeDefinition) {
    if (!nodeDefinition.id) {
      console.error('Node must have an id:', nodeDefinition);
      return;
    }
    
    // Validate required fields
    const required = ['category', 'name', 'icon', 'execute'];
    for (const field of required) {
      if (!nodeDefinition[field]) {
        console.error(`Node ${nodeDefinition.id} missing required field: ${field}`);
        return;
      }
    }
    
    // Set defaults
    nodeDefinition.config = nodeDefinition.config || {};
    nodeDefinition.suggests = nodeDefinition.suggests || [];
    nodeDefinition.color = nodeDefinition.color || '#6b6b7a';
    nodeDefinition.documentation = nodeDefinition.documentation || {};
    
    // Mark as core or community based on path
    nodeDefinition.isCore = !nodeDefinition.githubUsername;
    nodeDefinition.githubUsername = nodeDefinition.githubUsername || null;
    
    this.registeredNodes.set(nodeDefinition.id, nodeDefinition);
    
    // Dispatch event for real-time UI updates
    window.dispatchEvent(new CustomEvent('n9n:nodeRegistered', { 
      detail: { nodeId: nodeDefinition.id, category: nodeDefinition.category } 
    }));
    
    console.log(`✓ Node registered: ${nodeDefinition.name} (${nodeDefinition.category})`);
  },
  
  /**
   * Get all registered nodes as array (for backward compatibility)
   */
  getNodeTypes: function() {
    return Array.from(this.registeredNodes.values());
  },
  
  /**
   * Get nodes by category
   */
  getNodesByCategory: function(category) {
    return this.getNodeTypes().filter(n => n.category === category);
  },
  
  /**
   * Get core nodes (built-in)
   */
  getCoreNodes: function() {
    return this.getNodeTypes().filter(n => n.isCore);
  },
  
  /**
   * Get community nodes (user-created)
   */
  getCommunityNodes: function() {
    return this.getNodeTypes().filter(n => !n.isCore);
  },
  
  /**
   * Get a single node definition
   */
  getNode: function(id) {
    return this.registeredNodes.get(id);
  },
  
  /**
   * Load models for AI nodes
   */
  fetchModels: async function() {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models');
      const data = await res.json();
      if(data.data) {
        this.models = data.data.map(m => ({ id: m.id, name: m.name || m.id }));
      }
    } catch(e) {
      this.models = [
        { id: 'openai/gpt-4o', name: 'GPT-4o (Best for Complex Tasks)' },
        { id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash (Fast/Web Access)' },
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Writing)' },
        { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B (Open Source)' },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Fast & Cheap)' }
      ];
    }
  },
  
  /**
   * Get models as HTML options
   */
  getModelsOptions: function(selectedModel) {
    return this.models.map(m => 
      `<option value="${m.id}" ${selectedModel===m.id?'selected':''}>${m.name}</option>`
    ).join('');
  },
  
  /**
   * Template rendering helper
   */
  renderTemplate: function(str, data) {
    if (!str) return "";
    if (typeof data === 'object' && data !== null) {
      return str.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        path = path.trim();
        if (path.startsWith('data.')) path = path.replace('data.', '');
        if (path === 'data') {
          if (Array.isArray(data)) return data.join(', ');
          return JSON.stringify(data);
        }
        const value = path.split('.').reduce((acc, part) => acc && acc[part], data);
        return value !== undefined ? value : match;
      });
    }
    return str.replace(/\{\{data\}\}/g, data || "");
  },
  
  /**
   * Extract JSON from text (handles markdown code blocks)
   */
  extractJsonFromText: function(text) {
    if (!text) return null;
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      try { return JSON.parse(cleanText.substring(firstBracket, lastBracket + 1)); } catch (e) { }
    }
    
    const firstCurly = cleanText.indexOf('{');
    const lastCurly = cleanText.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
      try { return JSON.parse(cleanText.substring(firstCurly, lastCurly + 1)); } catch(e) {}
    }
    return null;
  },
  
  /**
   * Logging helper
   */
  addLog: function(msg, type = 'info') {
    const panel = document.getElementById('logPanel');
    if (!panel) return;
    
    const colors = { 
      info: 'text-[var(--fg-muted)]', 
      success: 'text-[var(--accent)]', 
      error: 'text-red-400', 
      warning: 'text-yellow-500' 
    };
    const div = document.createElement('div');
    div.className = `${colors[type]} py-0.5`;
    div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    panel.appendChild(div);
    panel.scrollTop = panel.scrollHeight;
  },
  
  /**
   * Config update helper
   */
  updateConfig: function(nodeId, key, value) {
    // This will be connected to the main app state
    if (window.appUpdateConfig) {
      window.appUpdateConfig(nodeId, key, value);
    }
  },
  
  /**
   * Check for prompt shortcuts
   */
  checkPromptShortcut: function(e, nodeId) {
    if(e.key === ' ' || e.key === 'Enter') {
      const val = e.target.value;
      const match = val.match(/\/(\w+)$/);
      
      if (match) {
        const key = match[1];
        const found = this.userSettings.promptShortcuts.find(s => s.key.trim() === key);
        
        if(found) {
          const newVal = val.substring(0, val.length - match[0].length) + found.value;
          e.target.value = newVal;
          e.preventDefault();
          this.addLog(`Shortcut /${key} replaced.`, 'info');
          this.updateConfig(nodeId, 'prompt', newVal);
        }
      }
    }
  },
  
  /**
   * Formatter rule helpers
   */
  addFormatterRule: function(nodeId) {
    if (window.appAddFormatterRule) {
      window.appAddFormatterRule(nodeId);
    }
  },
  
  removeFormatterRule: function(nodeId, index) {
    if (window.appRemoveFormatterRule) {
      window.appRemoveFormatterRule(nodeId, index);
    }
  },
  
  updateRule: function(nodeId, index, key, value) {
    if (window.appUpdateRule) {
      window.appUpdateRule(nodeId, index, key, value);
    }
  },
  
  /**
   * Community Nodes: Save custom node to localStorage
   */
  saveCustomNode: function(nodeDefinition) {
    const customNodes = this.getCustomNodes();
    customNodes[nodeDefinition.id] = nodeDefinition;
    localStorage.setItem('n9n_custom_nodes', JSON.stringify(customNodes));
    
    // Register the node
    this.registerNode(nodeDefinition);
    
    return true;
  },
  
  /**
   * Get custom nodes from localStorage
   */
  getCustomNodes: function() {
    try {
      const saved = localStorage.getItem('n9n_custom_nodes');
      return saved ? JSON.parse(saved) : {};
    } catch(e) {
      return {};
    }
  },
  
  /**
   * Load and register custom nodes from localStorage
   */
  loadCustomNodes: function() {
    const customNodes = this.getCustomNodes();
    Object.values(customNodes).forEach(nodeDef => {
      // Convert execute function from string if needed
      if (nodeDef.executeString && typeof nodeDef.executeString === 'string') {
        try {
          nodeDef.execute = new Function('node', 'inputData', nodeDef.executeString);
        } catch(e) {
          console.error(`Failed to parse execute function for ${nodeDef.id}:`, e);
          return;
        }
      }
      
      // Convert generateConfigForm from string if needed
      if (nodeDef.generateConfigFormString && typeof nodeDef.generateConfigFormString === 'string') {
        try {
          nodeDef.generateConfigForm = new Function('node', nodeDef.generateConfigFormString);
        } catch(e) {
          console.error(`Failed to parse generateConfigForm for ${nodeDef.id}:`, e);
        }
      }
      
      this.registerNode(nodeDef);
    });
    
    console.log(`Loaded ${Object.keys(customNodes).length} custom nodes from localStorage`);
  },
  
  /**
   * Delete a custom node
   */
  deleteCustomNode: function(nodeId) {
    const customNodes = this.getCustomNodes();
    delete customNodes[nodeId];
    localStorage.setItem('n9n_custom_nodes', JSON.stringify(customNodes));
    this.registeredNodes.delete(nodeId);
  },
  
  /**
   * Generate GitHub contribution URL
   */
  generateGitHubContributionUrl: function(nodeDefinition) {
    const fileName = `${nodeDefinition.id}.js`;
    const filePath = `nodes/community/${fileName}`;
    
    // Create the full node file content
    const nodeContent = this.generateNodeFileContent(nodeDefinition);
    
    // GitHub new file URL
    const baseUrl = 'https://github.com/new';
    const params = new URLSearchParams({
      filename: filePath,
      value: nodeContent
    });
    
    return `${baseUrl}?${params.toString()}`;
  },
  
  /**
   * Generate node file content for GitHub contribution
   */
  generateNodeFileContent: function(nodeDef) {
    return `/**
 * n9n Node: ${nodeDef.name}
 * Category: ${nodeDef.category}
 * Description: ${nodeDef.documentation?.description || nodeDef.name}
 * Author: ${nodeDef.githubUsername || 'Anonymous'}
 * Version: 1.0.0
 * Community Node: true
 */

n9n.registerNode({
  id: '${nodeDef.id}',
  category: '${nodeDef.category}',
  name: '${nodeDef.name}',
  color: '${nodeDef.color}',
  icon: \`${nodeDef.icon}\`,
  config: ${JSON.stringify(nodeDef.config || {}, null, 2)},
  suggests: ${JSON.stringify(nodeDef.suggests || [])},
  githubUsername: '${nodeDef.githubUsername || ''}',
  
  documentation: ${JSON.stringify(nodeDef.documentation || {}, null, 2)},

  generateConfigForm: (node) => {
    return \`${nodeDef.generateConfigFormString ? '<!-- Custom config form - see source -->' : '<!-- No custom config form -->'}\`;
  },

  execute: async (node, inputData) => {
${nodeDef.executeString || '    // TODO: Implement node logic\n    return inputData;'}
  }
});
`;
  },
  
  /**
   * Generate installation script for custom node
   */
  generateInstallScript: function(nodeDef) {
    return `// n9n Custom Node: ${nodeDef.name}
// Copy this entire code and paste it in the browser console
// Or save as ${nodeDef.id}.js in nodes/community/ folder

(function() {
  const nodeDef = ${JSON.stringify({
    id: nodeDef.id,
    category: nodeDef.category,
    name: nodeDef.name,
    color: nodeDef.color,
    icon: nodeDef.icon,
    config: nodeDef.config,
    suggests: nodeDef.suggests,
    githubUsername: nodeDef.githubUsername,
    documentation: nodeDef.documentation
  }, null, 2)};
  
  nodeDef.execute = async (node, inputData) => {
${nodeDef.executeString || '    return inputData;'}
  };
  
  if (typeof n9n !== 'undefined') {
    n9n.registerNode(nodeDef);
    console.log('✓ Node "${nodeDef.name}" installed!');
  } else {
    console.error('n9n not found. Are you on the n9n page?');
  }
})();`;
  }
};

console.log('n9n Node System initialized');


/*
Copyright (c) 2026 Aditya Gupta

This source code is licensed for personal and educational use only.
Commercial use is prohibited.
*/
