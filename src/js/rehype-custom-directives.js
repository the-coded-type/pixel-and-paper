import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

/**
 * Rehype plugin to transform custom directives into HTML elements.
 */
export default function remarkDirectiveRehype() {
  return (tree) => {
    visit(tree, (node) => {
      // --- Handle generic container/leaf/text directives ---
      // This logic turns :::name into <name class="name">, ::name into <name class="name">, and :name into <name class="name">
      // It processes any directive *unless* it's 'house' (which we handle specially below)
      if 
        (node.type === 'containerDirective')
       {
        const data = node.data || (node.data = {})
        const hast = h('section', {...(node.attributes || {}), class: node.name} )

        data.hName = hast.tagName
        data.hProperties = hast.properties
      } else if ( 
        node.type === 'leafDirective' ||
        node.type === 'textDirective') {
          const data = node.data || (node.data = {})
          const hast = h(node.name, node.attributes || {})
  
          data.hName = hast.tagName
          data.hProperties = hast.properties
        }

    });
  };
}
