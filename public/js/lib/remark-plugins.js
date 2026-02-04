import { visit } from 'unist-util-visit';
import { parse } from 'acorn';

function parseExpression(code) {
    return parse(code, {
      ecmaVersion: 2024,
      sourceType: "module"
    });
  }


  import { visit } from 'unist-util-visit';

  export function remarkExtendBlockquote() {
    return (tree) => {
      visit(tree, 'blockquote', (node, index, parent) => {
        // 1. Find the paragraph inside the blockquote
        const paragraph = node.children.find(child => child.type === 'paragraph');
        if (!paragraph) return;
  
        // 2. Extract the values
        const textNode = paragraph.children.find(n => n.type === 'text');
        const codeNode = paragraph.children.find(n => n.type === 'inlineCode');
  
        const quoteValue = textNode ? textNode.value.trim() : "";
        const citeValue = codeNode ? codeNode.value : "";
  
        // 3. Create a clean HTML structure
        // We overwrite the 'node' itself to ensure the old children (p, code) are gone
        const newNode = {
          type: 'blockquote', // The MDAST type
          data: { 
            hName: 'blockquote', // The HTML tag
            hProperties: { className: ['custom-quote'] } 
          },
          children: [
            // The quote text as a direct child or wrapped in a span
            { type: 'text', value: quoteValue },
            // The citation tag
            {
              type: 'element', 
              data: { hName: 'cite' },
              children: [{ type: 'text', value: citeValue }]
            }
          ]
        };
  
        // 4. Replace the old node in the parent's children array
        parent.children[index] = newNode;
      });
    };
  }


export { remarkExtendBlockquote }