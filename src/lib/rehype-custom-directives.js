import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

/**
 * Rehype plugin to transform custom directives into HTML elements.
 */
export default function rehypeCustomDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      // --- Handle generic container/leaf/text directives ---
      // This logic turns :::name into <name class="name">, ::name into <name class="name">, and :name into <name class="name">
      // It processes any directive *unless* it's 'house' (which we handle specially below)
      if (
        (node.type === 'containerDirective' ||
         node.type === 'leafDirective' ||
         node.type === 'textDirective') &&
        node.name !== 'house' // Exclude the 'house' directive from generic handling
      ) {
        const tagName = node.name; // The directive name becomes the tag name (e.g., 'note', 'alert')
        let element = null;

        if (node.type === 'containerDirective' || node.type === 'leafDirective') {
          // For block-level directives, use a <div> as a default fallback if you don't want the directive name as the tag
          // element = h('div', node.attributes, node.children);
          element = h(tagName, node.attributes, node.children); // Use directive name as tag
          element.properties.className = (element.properties.className || []).concat(tagName); // Add directive name as class
        } else if (node.type === 'textDirective') {
          // For inline directives, use a <span> as a default fallback
          // element = h('span', node.attributes, node.children);
          element = h(tagName, node.attributes, node.children); // Use directive name as tag
          element.properties.className = (element.properties.className || []).concat(tagName); // Add directive name as class
        }

        if (element) {
          // Replace the directive node in the HAST with our new HTML element
          Object.assign(node, element);
        }
      }

      // --- Handle the specific :::house directive ---
      if (node.type === 'containerDirective' && node.name === 'house') {
        const props = node.attributes || {}; // Get any attributes passed to :::house{attr="value"}

        // Create the <div> element with the 'house' class
        const divElement = h(
          'div',
          {
            ...props, // Spread any existing attributes (like id)
            className: (props.className || []).concat('house'), // Add the .house class
          },
          node.children // Include all the children (image, paragraphs, etc.)
        );

        // Replace the 'house' directive node with the new div element
        Object.assign(node, divElement);
      }
    });
  };
}
