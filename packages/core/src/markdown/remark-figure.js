import { visit } from 'unist-util-visit';

// We pass an empty imageMap object as argument

export function remarkExtendImage(imageMap = {}) {
  // Returns a function that crawls the tree
  // For more info see https://unifiedjs.com/explore/package/unist-util-visit/
  return (tree) => {
    // We visit 'paragraph' because images are usually wrapped in one
    // NB? We should also find images that are not in wrapped in p tags
    visit(tree, 'paragraph', (node, index, parent) => {
      // Find all image nodes in this paragraph
      // Returns an array, might be empty
      const images = node.children.filter( child => child.type=='image')

      // Check for non-whitespace text nodes
      const hasContent = node.children.some( child => child.type == 'text' && child.value.trim().lenght >0);
      
      // html p tags can't contain figures, only spam, em, a, img
      // to create a figure wrapping Paragraph must contain only one image and no text 
      // otherwise we ignore it let remark turn it into a simple tage
      // Condition: Paragraph contains exactly 1 image and NO other text content
      if (images.length ===1 && !hasContent) {
        const img = images[0]; // because images is an array
        // if an imageMap containing an url is passed to the remarkExtendImage as an argument pick that one, otherwise pick img.url (from the md img)
        const imgSrc = (imageMap && imageMap[img.url]) ? imageMap[img.url] : img.url;

        // We create an MDAST node
        // We could have created a flat html node containing the full figure as a string, but we want the node image to persist in the tree
        const figureNode = {
          type: 'containerDirective', // Use a standard block-level type, just a conventon
          data: {
            hName: 'figure',
            hProperties: {className: ['pagedjs-figure']}
          },
          children: [
            {type: 'image',
             url: imgSrc,
             alt: img.alt || '',
             title: img.title || ''
            }
          ]
        };

        // Add caption if title exists: ![alt](url "Title")
        if (img.title) {
          figureNode.children.push({
            type: 'figcaption', // Semantic type name for AST clarity
            data: {
              hName: 'figcaption', // 👈 TELLS REHYPE TO RENDER <figcaption>
              hProperties: { className: ['pagedjs-figcaption'] } // Optional class
            },
            children: [
              { type: 'text', value: img.title }
            ]
          });
        }

        // Replace the entire paragraph with the figure node
        parent.children[index] = figureNode;
      }
    });
  };
}