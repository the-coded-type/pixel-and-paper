import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
// import rehypeFormat from 'https://esm.sh/rehype-format';
import rehypeStringify from 'rehype-stringify'
import remarkSection from "./remark-section.js";
import remarkGfm from 'remark-gfm'; 
import { remarkExtendImage } from './remark-figure.js';
import remarkDirectiveRehype from './rehype-custom-directives.js';
import remarkDirective from 'remark-directive'; // ⚠️ Required to parse ::: syntax

export const renderMarkdown = async (md) => {
    console.time('Markdown Fetch & Process');


    // Convert Markdown to HTML using unified
    const htmlText = await unified()
      .use(remarkParse) // Markdown to AST
      .use(remarkGfm) // Git flavored MD
      .use(remarkDirective)
      .use(remarkDirectiveRehype)
      .use(remarkSection) // Add sections to H tags
      .use(remarkExtendImage) // Images to figures
      .use(remarkRehype, { allowDangerousHtml: true }) // AST to HTML
      // .use(rehypeFormat) // Pretty print HTML
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert AST to string
      .process(md); // Wait for this step to complete

      console.timeEnd('Markdown Fetch & Process'); // End time for markdown fetch and processing

     return  htmlText;
  }

////////////////////////////////////////
// takes array of css and single md file 
// returns a string containing the iframe
export const iframeHtml = async (css, md, pagedPolyfill, htlmContent = '', jsContent = '') => {
    // This needs error checking
    const allImportedStyles = Array.isArray(css) ? css : [css];

    const allMdContent = Array.isArray(md) ? md.join('\n') : md;

    const allStyles = allImportedStyles.map(style => ` <style>${style}</style>`).join('');

    let renderedHtmlfromMarkdown = '';
    if (allMdContent) {
        const processed = await renderMarkdown(allMdContent);
        // CRITICAL FIX: Check if it's an object or string
        renderedHtmlfromMarkdown = (typeof processed === 'string') 
            ? processed 
            : processed.value; // Access the VFile content
    }
    const renderedHtml = renderedHtmlfromMarkdown + htlmContent;

    const fullHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <base href="http://localhost:8080/">

    <script>${pagedPolyfill}</script>
    <script>
    class iframeRendered extends Paged.Handler {

    afterRendered(pages) {
        window.parent.postMessage("iframeRendered", "*")
    }
    }

    Paged.registerHandlers(iframeRendered);

    </script>
    ${jsContent.trim()}
    ${allStyles.trim()}
</head>
<body >
   ${renderedHtml.trim()}
</body>
</html>
`;

/*
const safeDataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(fullHtmlContent);

const econdedIframe = `<iframe width="100%" height="100%" src="${safeDataUrl}"></iframe>`;

 // FIX 2: Use Blob instead of Data URI
// This gives the iframe the same "localhost" origin as your app, allowing fonts to load.
const blob = new Blob([fullHtmlContent], { type: 'text/html' });
const blobUrl = URL.createObjectURL(blob);

// Return the iframe using the Blob URL
// Note: We don't need to encodeURIComponent the URL itself, it's already safe.
const encodedIframe = `<iframe width="100%" height="100%" src="${blobUrl}" style="border:none;"></iframe>`;
*/

return fullHtmlContent;
}