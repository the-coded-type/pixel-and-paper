import { visit } from 'https://esm.sh/unist-util-visit';

import { unified } from 'https://esm.sh/unified';


function sanitizeString(string) {
  return string.replaceAll('.', '').toLowerCase().trim().replaceAll(' ', '-');
}

export default function remarkSection() {
  return (tree) => {
    const treeChildren = tree.children;
    const newChildren = [];

    // Stack of open section depths (LIFO)
    const openSections = [];
    let sectionOpen = false;

    for (const child of treeChildren) {
      if (child.type === 'heading') {
        // Close sections that are deeper or equal

        while (openSections.length > 0 && openSections[openSections.length-1] >= child.depth) {
            openSections.pop();
            newChildren.push({type: 'html', value: '</section>'})
        }
       
        openSections.push(child.depth);

      //  const sectionClass = child.children?.[0].type === 'text' ? child.children[0].value : null;
      /*
        
      */

// Helper function to get the text value from a node, recursively
function nodeTextValue(n) {
  const childrenArray = n?.filter(c => c.type === 'text') || [];

  if (childrenArray.length > 0) {
    // If there are text children, join their values into one string
    return childrenArray.map(c => c.value).join(' ');
  } else {
    // If no text children, recurse into the first child (if it has children)
    return nodeTextValue(n[0].children[0]);
  }

  // Return an empty string if no text found
  return '';
}
        /*
        const sectionClass = child.children
            ?.filter((c) => c.type === 'text')
            .map((c) => c.value)
            .join(' ')
            || null;
        */

        const sectionClass = nodeTextValue(child.children); 
            
        const openingTag = sectionClass
          ? `<section class="${sanitizeString(sectionClass)}">`
          : '<section>';

        newChildren.push({
          type: 'html',
          value: openingTag,
        });
      }

      // Always keep original node
      newChildren.push(child);
    }

    // Close any remaining open sections at end of document
    while (openSections.length > 0) {
      openSections.pop();
      newChildren.push({
        type: 'html',
        value: '</section>',
      });
    }

    tree.children = newChildren;
  };
}
