/**
 * n9n Node: Text Formatter
 * Category: logic
 * Description: Format and clean text with find/replace rules
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'text-formatter',
  category: 'logic',
  name: 'Text Formatter',
  color: '#a855f7',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />`,
  config: { 
    targetKey: 'body', 
    outputType: 'extract', 
    rules: [{find: '##', replace: ''}, {find: '\\n\\n', replace: ' '}] 
  },
  suggests: ['post-to-x', 'post-linkedin'],
  
  documentation: {
    description: 'Cleans and formats text using find/replace rules. Useful for removing markdown or formatting for social media.',
    input: 'String or object with text field',
    output: 'Cleaned text or modified object based on settings',
    example: 'Removes ## markdown headers and converts double newlines to spaces'
  },

  generateConfigForm: (node) => {
    if(!node.config.rules) node.config.rules = [];
    
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Target JSON Key</label>
        <input type="text" value="${node.config.targetKey || ''}" onchange="n9n.updateConfig('${node.id}', 'targetKey', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2" placeholder="body">
        <p class="text-[10px] text-[var(--fg-muted)] mt-1">Which key to clean? (e.g., 'body')</p>
      </div>
      
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Output Type</label>
        <select onchange="n9n.updateConfig('${node.id}', 'outputType', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
          <option value="extract" ${node.config.outputType==='extract'?'selected':''}>Extracted Text ({{data}})</option>
          <option value="object" ${node.config.outputType==='object'?'selected':''}>Modified Object (JSON)</option>
        </select>
      </div>
      
      <div class="border-t border-[var(--border)] pt-3 mt-3">
        <div class="flex justify-between items-center mb-2">
          <p class="text-xs font-bold text-[var(--fg-muted)]">Find & Replace Rules</p>
          <button onclick="n9n.addFormatterRule('${node.id}')" class="text-[10px] bg-[var(--accent)] text-black px-2 py-0.5 rounded">Add Rule</button>
        </div>
        
        <div id="rules-container" class="space-y-2">
          ${node.config.rules.map((rule, index) => `
            <div class="grid grid-cols-12 gap-1 items-center">
              <div class="col-span-5">
                <input type="text" value="${rule.find || ''}" onchange="n9n.updateRule('${node.id}', ${index}, 'find', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-1 text-xs" placeholder="Find">
              </div>
              <div class="col-span-5">
                <input type="text" value="${rule.replace || ''}" onchange="n9n.updateRule('${node.id}', ${index}, 'replace', this.value)" class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-1 text-xs" placeholder="Replace">
              </div>
              <div class="col-span-2 text-center">
                <button onclick="n9n.removeFormatterRule('${node.id}', ${index})" class="text-red-400 hover:text-red-300 text-lg leading-none">&times;</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  execute: async (node, inputData) => {
    let textToProcess = '';
    let isJson = false;
    let resultObj = {};

    const processString = (str) => {
      if(str === null || str === undefined) return '';
      return String(str).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    };

    if (typeof inputData === 'object' && inputData !== null && !Array.isArray(inputData)) {
      isJson = true;
      resultObj = { ...inputData }; 
      const key = node.config.targetKey || 'body';
      if (resultObj[key] !== undefined) {
        textToProcess = resultObj[key];
      } else {
        throw new Error(`Key "${key}" not found in JSON input.`);
      }
    } else if (typeof inputData === 'string') {
      textToProcess = inputData;
    } else {
      return inputData; 
    }

    if(node.config.rules && Array.isArray(node.config.rules)) {
      node.config.rules.forEach(rule => {
        if(rule.find) {
          textToProcess = textToProcess.split(processString(rule.find)).join(processString(rule.replace));
        }
      });
    }

    if (node.config.outputType === 'extract') {
      return textToProcess;
    } else {
      if (isJson) {
        resultObj[node.config.targetKey || 'body'] = textToProcess;
        return resultObj;
      }
      return textToProcess; 
    }
  }
});
