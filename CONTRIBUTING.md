# Contributing to n9n

Thank you for your interest in contributing to n9n! This document provides guidelines for contributing to the project.

## Ways to Contribute

### 1. Create Custom Nodes ⭐

The easiest way to contribute is by creating custom nodes:

- Use the **Node Builder** in the app (Library → Create Node)
- Or create a `.js` file in `nodes/community/`
- Share your node with the community!

### 2. Improve Core Code

Help improve the n9n core:

- Bug fixes
- Performance improvements
- New features
- Better documentation

### 3. Report Issues

Found a bug? Have an idea?

- [Open an Issue](https://github.com/yourusername/n9n/issues)
- Describe the problem clearly
- Include steps to reproduce
- Suggest a solution if possible

## Node Contribution Guidelines

### File Naming

```
nodes/community/your-node-name.js
```

Use kebab-case (lowercase with hyphens) for file names.

### Required Fields

Every node must have:

```javascript
{
  id: 'unique-node-id',        // Unique identifier
  category: 'action',          // Node category
  name: 'My Node',             // Display name
  color: '#hexcolor',          // Brand color
  icon: '<svg...>',            // SVG icon path
  execute: async (node, input) => { }  // Execute function
}
```

### Documentation Standards

Good documentation helps users:

```javascript
documentation: {
  description: 'Clear, concise description of what the node does',
  input: 'What type of input is expected (string, object, array)',
  output: 'What the node returns',
  example: 'Practical usage example'
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Comment complex logic
- Use descriptive variable names

Example:

```javascript
execute: async (node, inputData) => {
  // Validate input
  if (!inputData) {
    throw new Error('Input is required');
  }
  
  // Process data
  const result = processData(inputData);
  
  // Log success
  n9n.addLog(`Processed successfully: ${result}`, 'success');
  
  return result;
}
```

### Testing Your Node

Before submitting:

1. Test with various inputs
2. Test with empty/null inputs
3. Check error handling
4. Verify config form works
5. Test the complete workflow

## Submitting Your Contribution

### Via Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b node/my-awesome-node`
3. Add your node file
4. Commit with a clear message
5. Push and create a PR

### PR Title Format

```
Add [Node Name] - Brief description

Examples:
- Add Discord Webhook Node - Send messages to Discord channels
- Add CSV Parser Node - Parse and transform CSV data
```

### PR Description

Include:

- What the node does
- Why it's useful
- Testing instructions
- Screenshots (if applicable)

## Code of Conduct

- Be respectful and inclusive
- Help others learn
- Accept constructive criticism
- Focus on what's best for the community

## Recognition

Contributors will be:

- Listed in the README
- Credited in node documentation
- Mentioned in release notes

## Questions?

- [Discussions](https://github.com/yourusername/n9n/discussions)
- [Discord](https://discord.gg/n9n) (if available)

Thank you for making n9n better! 🚀
