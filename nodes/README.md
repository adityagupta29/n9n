# n9n Nodes

This directory contains all available nodes for n9n.

## Directory Structure

```
nodes/
├── core/           # Built-in core nodes
│   ├── trigger/    # Workflow trigger nodes
│   ├── ai/         # AI-related nodes
│   ├── logic/      # Data processing nodes
│   ├── action/     # General action nodes
│   └── integration/# Third-party integrations
│
└── community/      # Community-contributed nodes
    └── (your nodes here)
```

## How Nodes Work

Each node is a self-contained JavaScript file that:

1. **Registers itself** using `n9n.registerNode()`
2. **Defines metadata** (name, category, icon, etc.)
3. **Implements an execute function** that processes data

### Node Lifecycle

1. **Registration** - Node file loads and registers with the system
2. **UI Rendering** - Node appears in sidebar based on category
3. **User Configuration** - User drags node to canvas and configures it
4. **Execution** - Workflow runs, node's execute function is called
5. **Output** - Node returns data for the next node

## Creating a New Node

### Option 1: Use the Node Builder (Easiest)

1. Open n9n in browser
2. Click **Library** in top navbar
3. Switch to **Create Node** tab
4. Fill in the form and create your node

### Option 2: Manual File Creation

1. Create a `.js` file in appropriate directory
2. Copy the node template below
3. Customize for your use case
4. Add script tag to `index.html`
5. Refresh browser

## Node Template

```javascript
/**
 * n9n Node: [Your Node Name]
 * Category: [trigger|ai|logic|action|integration|community]
 * Description: [What it does]
 * Author: [Your GitHub username]
 * Version: 1.0.0
 */

n9n.registerNode({
  // Required fields
  id: 'unique-node-id',
  category: 'action',
  name: 'Your Node Name',
  color: '#3b82f6',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..."/>`,
  
  // Optional fields
  config: {
    option1: 'default value',
    option2: 42
  },
  suggests: ['next-node-id', 'another-node'],
  githubUsername: 'your-username',
  
  // Documentation
  documentation: {
    description: 'What this node does',
    input: 'What input it expects',
    output: 'What output it produces',
    example: 'Example usage'
  },

  // Optional: Custom config form HTML
  generateConfigForm: (node) => {
    return `
      <div>
        <label class="block text-xs text-[var(--fg-muted)] mb-1">Option</label>
        <input type="text" value="${node.config.option1}" 
               onchange="n9n.updateConfig('${node.id}', 'option1', this.value)"
               class="w-full bg-[var(--bg)] border border-[var(--border)] rounded p-2">
      </div>
    `;
  },

  // Required: Execute function
  execute: async (node, inputData) => {
    // node.config - contains user configuration
    // inputData - data from previous node
    
    // Your logic here
    const result = processInput(inputData, node.config);
    
    // Optional: Log progress
    n9n.addLog('Processing complete!', 'success');
    
    // Return output for next node
    return result;
  }
});
```

## Helper Functions

Available in execute function:

| Function | Description | Example |
|----------|-------------|---------|
| `n9n.addLog(msg, type)` | Add log message | `n9n.addLog('Done!', 'success')` |
| `n9n.renderTemplate(str, data)` | Render template | `n9n.renderTemplate('Hi {{name}}', {name: 'John'})` |
| `n9n.extractJsonFromText(text)` | Extract JSON | `n9n.extractJsonFromText(response)` |
| `n9n.getModelsOptions(selected)` | Get AI models | For AI node dropdowns |
| `n9n.userSettings.apiKey` | User's API key | Access global settings |

## Log Types

- `info` - General information (gray)
- `success` - Success messages (green/accent)
- `error` - Error messages (red)
- `warning` - Warnings (yellow)

## Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| `trigger` | Start workflows | Manual, Schedule, Webhook |
| `ai` | AI operations | Ask AI, AI Writer |
| `logic` | Data processing | Split, Loop, Format |
| `action` | General actions | Open URL, Scrape |
| `integration` | External services | Email, Social Media |
| `community` | User contributions | Custom nodes |

## Best Practices

### 1. Input Validation

```javascript
execute: async (node, inputData) => {
  if (!inputData) {
    throw new Error('Input is required');
  }
  // ...
}
```

### 2. Error Handling

```javascript
execute: async (node, inputData) => {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    n9n.addLog(`Error: ${error.message}`, 'error');
    throw error;
  }
}
```

### 3. Progress Logging

```javascript
execute: async (node, inputData) => {
  n9n.addLog('Starting process...', 'info');
  
  const step1 = await doStep1();
  n9n.addLog('Step 1 complete', 'success');
  
  const step2 = await doStep2();
  n9n.addLog('Step 2 complete', 'success');
  
  return step2;
}
```

### 4. Config with Defaults

```javascript
config: {
  timeout: 5000,     // Default value
  retries: 3         // Sensible default
}

// In execute:
const timeout = node.config.timeout || 5000;
```

## Testing Your Node

1. **Load the node**
   - Add script tag to index.html
   - Refresh browser
   - Check console for errors

2. **Test in UI**
   - Drag node to canvas
   - Configure it
   - Check config panel

3. **Test execution**
   - Connect to other nodes
   - Run workflow
   - Check logs

4. **Test edge cases**
   - Empty input
   - Invalid input
   - Network errors
   - Large data

## Contributing Your Node

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:

- Submission guidelines
- Code style
- PR process
- Recognition

## Examples

See `nodes/community/example-node.js` for a complete, documented example.

## Questions?

- Check [main README](../README.md)
- Open an issue
- Join discussions
