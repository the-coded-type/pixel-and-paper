import { visit } from 'unist-util-visit';
import { parse } from 'acorn';
import path from 'path';
import fs from 'fs';

function parseExpression(code) {
    return parse(code, {
      ecmaVersion: 2024,
      sourceType: "module"
    });
  }


function remarkExtendBlockquote () {
  return (tree) => {
    visit(tree, 'blockquote', function (node, index, parent) {
      // const blockquoteQuote = node.children[0].children[0].value || '';;
      const textNode = node.children[0].children.find((element) => element.type == "text");
      const codeNode = node.children[0].children.find((element) => element.type == "inlineCode");

      const blockquoteQuote = textNode ? textNode.value : '';
      const blockquoteBy = codeNode ? codeNode.value : ''; 

      let newNode = {
          type: 'mdxJsxFlowElement',
          name: 'blockquote',
          attributes: [],
          children: [{ 
            type: 'mdxJsxFlowElement',
            name: 'p',
            attributes: [],
            children: [{ type: 'text', value: blockquoteQuote }]
          },
          { 
            type: 'mdxJsxFlowElement',
            name: 'cite',
            attributes: [],
            children: [{ type: 'text', value: blockquoteBy }]
          }
        ]
      }
      parent.children[index] = newNode;
    })
  }
}


function remarkExtendImage () {
        return function (tree, file) {

        /* Checks if the mdx file has an import statement for the Astro Picture component */
        const alreadyHasImport = tree.children.some(
          (n) => n.type === 'mdxjsEsm' && n.value.includes("Picture")
        );
    
        if (!alreadyHasImport) {
          tree.children.unshift({
            type: 'mdxjsEsm',
            value: `import { Picture } from 'astro:assets';`,
            data: {
              estree: parseExpression(`import { Picture } from 'astro:assets';`)
            }
          });
        }

      /* End check if the mdx file has an import statement for the Astro Picture component */

        visit(tree, 'paragraph', function (node, index, parent) { 
          // looks for paragraphs because markdown wraps images with p tags, but p tags can't contain figure tags
          // hence we remove p tags wrapping single img tags
            if (node.children[0].type == 'image') {
              const imageNode = node.children[0];
              const imageAlt = imageNode.alt || '';
              
              let newNode;

              // Helper function, return empty node
              function returnEmptyNode() {
                newNode={};
                parent.children[index] = newNode;
                return
              }
  
              // Check if imageNode.url exists, if not return tempty node
              if (!imageNode.url) {
                returnEmptyNode();
              } 

              const isRemoteImage = (url) => {
                if (typeof url !=="string") return false;
                return (
                  /^https?:\/\//i.test(url) ||     // http:// or https://
                  /^\/\//.test(url) ||             // protocol-relative
                  /^data:/i.test(url) ||           // data URI
                  /^blob:/i.test(url)              // blob://
                );
              }


              const sanitizedUrl = (url) => url.startsWith('/') ? url : '/'+url;

              const isLocalImage = (url) => {
                if (typeof url !=="string") return false;
                const absoluteImagePath = path.resolve(
                `src/media${url}`            
                );
                return fs.existsSync(absoluteImagePath);
              }

              // Check the type of image remote, local, error
              const imageType = (url) => {
                if (!url || typeof url !== "string") return {success: false, type: 'error'};
                // Check if it is remote
                if (isRemoteImage(url)) {return {success: true, type: 'remote', src: url}};
                if (isLocalImage(sanitizedUrl(url))) {return {success: true, type: 'local', src: url}};
                return {success: false, type: 'error'};
              }
              
              const imageNodeType = imageType(imageNode.url);

              if (!imageNodeType.success) {return returnEmptyNode()}

              const generateImageNode = (imageNodeType) => {
                if (imageNodeType.type == 'remote') return {type: 'mdxJsxAttribute', name: 'src', value: imageNodeType.src};
                if (imageNodeType.type == 'local') return {type: 'mdxJsxAttribute', name: 'src', value: {type: 'mdxJsxAttributeValueExpression', value: `import('@media/${imageNodeType.src}')`, data: { estree: parseExpression(`import("@media/${imageNodeType.src}")`) }}};
                return null;
              }
                
              const newImageNode = generateImageNode(imageNodeType);

                newNode = {
                        type: 'mdxJsxFlowElement',
                        name: 'figure',
                        attributes: [],  
                        children: [
                            {
                            type: 'mdxJsxFlowElement',
                            name: 'Picture',
                            attributes: [newImageNode,
                            {type: 'mdxJsxAttribute', name: 'alt', value: imageAlt},
                            {type: 'mdxJsxAttribute', name: 'formats', value: {
                                type: 'mdxJsxAttributeValueExpression',
                                value: `["avif", "webp"]`,
                                data: {
                                  estree: parseExpression(`["avif", "webp"]`)
                                }
                              }
                            },
                            {type: 'mdxJsxAttribute', name: 'widths', value: {
                                type: 'mdxJsxAttributeValueExpression',
                                value: `[240, 540, 720]`,
                                data: {
                                  estree: parseExpression(`[240, 540, 720]`)
                                }
                              }
                            },
                            {type: 'mdxJsxAttribute', name: 'height', value: 720},  
                            {type: 'mdxJsxAttribute', name: 'width', value: 1080},   
                            {type: 'mdxJsxAttribute', name: 'sizes', value: '(max-width: 360px) 240px, (max-width: 720px) 480px, (max-width: 1600px) 720px'},          
                        ], 
                    }
                ]
              }
    
              if (imageNode.title) {
                const imageTitle = `Image: ${imageNode.title}`;
                newNode.children.push(
                  {type: 'mdxJsxFlowElement',
                    name: 'figcaption',
                    attributes: [],
                    children: [{ type: 'text', value: imageTitle }]
                  }
                )
              }
    
              parent.children[index] = newNode;


            }

           
      })
    }
}


export { remarkExtendImage, remarkExtendBlockquote }