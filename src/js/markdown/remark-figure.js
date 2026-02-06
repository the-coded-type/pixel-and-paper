import { visit } from 'unist-util-visit';

export function remarkExtendImage(imageMap = {}) {
  return (tree) => {
    // We visit 'paragraph' because images are usually wrapped in one
    // We should also find images that are not in wrapped in p tags
    visit(tree, 'paragraph', (node, index, parent) => {
      // Find all image nodes in this paragraph
      const images = node.children.filter(child => child.type === 'image');

      if (images.length > 0) {
        console.log('remarkEtendImage: images', images)
      }
      
      // Check for non-whitespace text nodes
      const hasContent = node.children.some(child => 
        child.type === 'text' && child.value.trim().length > 0
      );

      // Condition: Paragraph contains exactly 1 image and NO other text content
      if (images.length === 1 && !hasContent) {
        const img = images[0];
        const finalSrc = (imageMap && imageMap[img.url]) ? imageMap[img.url] : img.url;

        // CRITICAL: We create an MDAST node but manually define its HTML output
        const figureNode = {
          type: 'containerDirective', // Use a standard block-level type
          data: {
            hName: 'figure',
            hProperties: { className: ['pagedjs-figure'] }
          },
          children: [
            {
              type: 'image',
              url: finalSrc,
              alt: img.alt || '',
              title: img.title || '',
              data: {
                hName: 'img',
                hProperties: { 
                    src: finalSrc,
                    loading: 'lazy' // Note sure about that
                }
              }
            }
          ]
        };

        // Add caption if title exists: ![alt](url "Title")
        if (img.title) {
          figureNode.children.push({
            type: 'paragraph',
            data: { hName: 'figcaption' },
            children: [{ type: 'text', value: img.title }]
          });
        }

        // Replace the entire paragraph with the figure node
        parent.children[index] = figureNode;
      }
    });
  };
}