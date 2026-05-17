# n9n - The Free n8n Alternative

A free, open-source workflow automation tool with a powerful visual node-based interface. Built for the community, by the community.

![n9n Logo](./assets/logo.png)

## 🚀 Features

- **Visual Workflow Builder** - Drag and drop nodes to create automated workflows
- **AI Integration** - Built-in AI nodes powered by OpenRouter (GPT-4, Claude, Llama, etc.)
- **Social Media Automation** - Post to X (Twitter), LinkedIn, Instagram DMs
- **Email Automation** - Draft and send emails
- **Web Scraping** - Extract data from any website
- **Community Nodes** - Create and share custom nodes with the community
- **Free & Open Source** - No subscriptions, no limits

## 📁 Project Structure

```
n9n/
├── index.html              # Main application file
├── js/
│   └── n9n.js             # Core node system and registry
├── nodes/
│   ├── core/              # Built-in core nodes
│   │   ├── manual-trigger.js
│   │   ├── ask-ai.js
│   │   ├── post-to-x.js
│   │   └── ... (18 core nodes)
│   └── community/         # Community-contributed nodes
│       └── (your custom nodes here)
├── css/                   # Styles (if needed)
└── README.md
```

## 🎯 Available Core Nodes

### Triggers
- **Manual Trigger** - Start workflow with button click
- **Static Data** - Input CSV, JSON, or plain text
- **Daily Trigger** - Schedule daily runs

### AI
- **Ask AI** - Generic AI prompt with any model
- **AI Writer** - Structured content generation

### Logic
- **Split Text** - Split strings by delimiter
- **Loop Items** - Iterate over arrays
- **Loop JSON** - Iterate over object arrays
- **Delay** - Add pauses between nodes
- **Text Formatter** - Find/replace text transformations

### Actions
- **Open URL** - Open URLs in new tabs
- **Web Scraper** - Extract website data with CSS selectors

### Integrations
- **Draft Email** - Open email client with pre-filled content
- **Auto Email** - Send via webhook/API
- **WordPress Draft** - Create WordPress posts
- **Post to X** - Post to Twitter/X
- **Post to LinkedIn** - Share on LinkedIn
- **Instagram DM** - Open Instagram DM threads

## 🛠️ Creating Custom Nodes

### Method 1: Using the Node Builder (Recommended for Beginners)

1. Click **Library** in the top navbar
2. Switch to the **Create Node** tab
3. Fill in the details:
   - **Node Name** - Display name
   - **Category** - Where it appears in the sidebar
   - **Icon Color** - Visual identifier
   - **SVG Icon** - Find icons at [heroicons.com](https://heroicons.com)
   - **Description** - Help users understand your node
   - **GitHub Username** - Get recognition!

4. Write your **Execute Function**:

```javascript
// node - contains the node's config
// inputData - data from the previous node
// Return the output data for the next node

const text = inputData || '';
const result = text.toUpperCase();
n9n.addLog('Converted to uppercase: ' + result, 'success');
return result;
```

5. Click **Create Node & Save Locally**

### Method 2: Creating a Node File (For Developers)

Create a new `.js` file in the `nodes/community/` folder:

```javascript
/**
 * n9n Node: My Custom Node
 * Category: action
 * Description: What my node does
 * Author: your-github-username
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'my-custom-node',           // Unique identifier
  category: 'action',             // trigger | ai | logic | action | integration | community
  name: 'My Custom Node',         // Display name
  color: '#ec4899',               // Brand color
  icon: `<path stroke-linecap="round" ... />`,  // SVG icon path
  config: {                       // Default config
    option1: 'default value',
    option2: 42
  },
  suggests: ['next-node-id'],     // Suggested next nodes
  githubUsername: 'your-username', // For attribution
  
  documentation: {
    description: 'Detailed description of what this node does',
    input: 'What input it expects',
    output: 'What output it produces',
    example: 'Example usage scenario'
  },

  // Optional: Custom config form
  generateConfigForm: (node) => {
    return `
      <div>
        <label>Option 1</label>
        <input onchange="n9n.updateConfig('${node.id}', 'option1', this.value)" 
               value="${node.config.option1}">
      </div>
    `;
  },

  // Required: Execute function
  execute: async (node, inputData) => {
    // Your logic here
    const result = doSomething(inputData);
    n9n.addLog('Processing complete!', 'success');
    return result;
  }
});
```

## 🤝 Contributing Nodes to the Community

### Via GitHub Pull Request (Recommended)

1. **Fork** this repository on GitHub
2. **Clone** your fork locally
3. Create a new file in `nodes/community/`:
   ```bash
   touch nodes/community/my-awesome-node.js
   ```
4. **Copy your node code** into the file
5. **Test** your node locally
6. **Commit** with a descriptive message:
   ```bash
   git add nodes/community/my-awesome-node.js
   git commit -m "Add My Awesome Node - converts text to emoji"
   ```
7. **Push** to your fork:
   ```bash
   git push origin main
   ```
8. Create a **Pull Request** on GitHub

### Via GitHub Issue (Easy Method)

1. In n9n, go to **Library** → **My Nodes**
2. Click **Share** on your custom node
3. Click **Create Issue**
4. GitHub will open with a pre-filled template
5. Submit the issue with your node code

### Node Contribution Guidelines

- ✅ Nodes should have clear, descriptive names
- ✅ Include documentation (description, input, output, example)
- ✅ Use consistent code style
- ✅ Test your node thoroughly
- ✅ Add your GitHub username for attribution
- ✅ Choose appropriate category
- ❌ No malicious code
- ❌ No hardcoded API keys (use config)

## 📝 Node Template

```javascript
/**
 * n9n Node: [Node Name]
 * Category: [trigger|ai|logic|action|integration|community]
 * Description: [What it does]
 * Author: [Your GitHub username]
 * Version: 1.0.0
 */

n9n.registerNode({
  id: '[unique-node-id]',
  category: '[category]',
  name: '[Display Name]',
  color: '#hexcolor',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..."/>`,
  config: {},
  suggests: [],
  githubUsername: '[your-username]',
  
  documentation: {
    description: 'What this node does',
    input: 'Expected input',
    output: 'Produced output',
    example: 'Usage example'
  },

  execute: async (node, inputData) => {
    // Implementation
    return outputData;
  }
});
```

## 🔧 Available Helper Functions

Inside your node's execute function, you have access to:

```javascript
// Logging
n9n.addLog('Message', 'info');     // info | success | error | warning

// Template rendering (handlebars-style)
const result = n9n.renderTemplate('Hello {{data}}', { name: 'World' });
// Result: "Hello World"

// JSON extraction from text
const json = n9n.extractJsonFromText(textWithJson);

// Access models for AI nodes
const models = n9n.models;
const options = n9n.getModelsOptions(selectedModel);

// User settings
const apiKey = n9n.userSettings.apiKey;
```

## 🎨 Node Categories

| Category | Description | Color Code |
|----------|-------------|------------|
| `trigger` | Workflow starters | `#10b981` (Green) |
| `ai` | AI/ML operations | `#8b5cf6` (Purple) |
| `logic` | Data processing | `#a855f7` (Violet) |
| `action` | General actions | `#3b82f6` (Blue) |
| `integration` | External services | `#f59e0b` (Orange) |
| `community` | User-contributed | `#ec4899` (Pink) |

## 🔐 Settings

Click the **⚙️ Settings** button to configure:

- **Default OpenRouter API Key** - For AI nodes
- **Prompt Shortcuts** - Create shortcuts like `/intro` that expand to full prompts

Settings are saved to browser localStorage.

## 💾 Storage

n9n uses browser localStorage for:
- Workflow states
- Saved workflows
- User settings
- Custom nodes

**Note:** Clear your browser data will erase your workflows. Export important workflows!

## 🐛 Troubleshooting

### Node not appearing?
- Check browser console for errors
- Verify the node file is loaded in index.html
- Ensure `id` is unique

### Execute function not working?
- Check for JavaScript syntax errors
- Use `n9n.addLog()` to debug
- Verify inputData handling for null/undefined

### GitHub contribution not working?
- Update the repository URL in the code
- Ensure you're logged into GitHub

## 🚧 Roadmap

- [ ] Server-side execution
- [ ] Webhook triggers
- [ ] Database integrations
- [ ] More AI providers
- [ ] Node marketplace
- [ ] Workflow sharing
- [ ] Team collaboration

## 🤝 Contributing to n9n Core

Want to improve n9n itself? We welcome contributions!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📜 License

This project is source-available for learning and personal use only.

Commercial usage, resale, SaaS hosting, redistribution, or monetization is prohibited without written permission.

© 2026 Aditya Gupta

## 🙏 Acknowledgments

- Inspired by [n8n](https://n8n.io)
- Icons from [Heroicons](https://heroicons.com)
- AI powered by [OpenRouter](https://openrouter.ai)
- Built by the community ❤️

---

**Made with ❤️ by the n9n Community**

[GitHub](https://github.com/adityagupta29/n9n) • [Issues](https://github.com/adityagupta29/n9n/issues) • [Discussions](https://github.com/adityagupta29/n9n/discussions)
