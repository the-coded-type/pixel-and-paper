import {visit} from 'unist-util-visit'

// Plugin to wrap H2 tags and the contents that follow them into a <section>
function sanitizeString(string) {
  // Added safe check in case string is undefined/null
  if (!string) return '';
  return string.replaceAll('.', '').replaceAll("’", '').toLowerCase().trim().replaceAll(' ', '-');
}

// Helper to safely extract text from children arrays
function nodeTextValue(childrenArray) {
  if (!childrenArray || !Array.isArray(childrenArray)) return '';

  // 1. Try to find direct text nodes in this array
  const textNodes = childrenArray.filter(c => c.type === 'text');
  
  if (textNodes.length > 0) {
    return textNodes.map(c => c.value).join(' ');
  } 
  
  // 2. If no text, look deeper into the first child's children
  if (childrenArray.length > 0 && childrenArray[0].children) {
    // FIX: Pass the children ARRAY, not the node object
    return nodeTextValue(childrenArray[0].children);
  }

  return '';
}

export default function remarkSection() {
  return (tree) => {
    const newChildren = [];
    const openSections = []; // Stack of depths (h1, h2...)

    // Iterate top-level nodes
    for (const child of tree.children) {
      if (child.type === 'heading') {
        // Close sections deeper or equal to current heading
        while (openSections.length > 0 && openSections[openSections.length - 1] >= child.depth) {
            openSections.pop();
            newChildren.push({ type: 'html', value: '</section>' });
        }
       
        // O
        openSections.push(child.depth);

        // Extract text for class name
        const rawText = nodeTextValue(child.children); 

        const className = sanitizeString(rawText);

        const depth = child.depth;
            
        const openingTag = className
          ? `<section class="${className} ${className}-${child.depth} d-${child.depth}">`
          : `<section class="d-${child.depth}">`;

        newChildren.push({ type: 'html', value: openingTag });
      }

      // Keep the original node (the heading itself)
      newChildren.push(child);
    }

    // Close any sections still open at the end
    while (openSections.length > 0) {
      openSections.pop();
      newChildren.push({ type: 'html', value: '</section>' });
    }

    tree.children = newChildren;
  };
}