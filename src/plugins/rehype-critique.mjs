import { visit } from 'unist-util-visit';

export function rehypeCritique() {
  return (tree, file) => {
    const frontmatter = file.data.astro?.frontmatter;
    
    // If no AI annotations, skip
    if (!frontmatter || !frontmatter.aiAnnotations || !Array.isArray(frontmatter.aiAnnotations)) {
      return;
    }

    const annotations = frontmatter.aiAnnotations;

    visit(tree, 'text', (node, index, parent) => {
      if (!node.value) return;

      for (const annotation of annotations) {
        const { originalText, critique, severity } = annotation;
        if (node.value.includes(originalText)) {
          // Found a match!
          // We need to split the text node into [before, match, after]
          
          const start = node.value.indexOf(originalText);
          const end = start + originalText.length;
          
          const before = node.value.slice(0, start);
          const match = node.value.slice(start, end);
          const after = node.value.slice(end);

          const newNodes = [];

          if (before) {
            newNodes.push({ type: 'text', value: before });
          }

          // The highlighted span
          newNodes.push({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['ai-critique-trigger'],
              'data-critique': critique,
              'data-severity': severity || 'warning',
            },
            children: [{ type: 'text', value: match }]
          });

          if (after) {
            newNodes.push({ type: 'text', value: after });
          }

          // Replace the current node with the new nodes
          parent.children.splice(index, 1, ...newNodes);
          
          // We stop processing this node (and the new nodes we just added)
          // to avoid infinite loops or double matching. 
          // In a more robust implementation, we might continue searching in 'after'.
          return [visit.SKIP]; 
        }
      }
    });
  };
}
