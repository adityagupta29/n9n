/**
 * n9n Node: Manual Trigger
 * Category: trigger
 * Description: Start workflow manually by clicking the Run button
 * Author: n9n
 * Version: 1.0.0
 */

n9n.registerNode({
  id: 'manual-trigger',
  category: 'trigger',
  name: 'Manual Trigger',
  color: '#10b981',
  icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  config: {},
  suggests: ['ask-ai', 'static-data'],
  
  // Documentation for users
  documentation: {
    description: 'Starts your workflow manually by clicking the Run button.',
    input: 'None',
    output: 'Simple string "Triggered"',
    example: 'Use this to test your workflows before setting up automatic triggers.'
  },

  // Execute function
  execute: async (node, inputData) => {
    return "Triggered";
  }
});
