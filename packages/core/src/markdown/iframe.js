import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
// import rehypeFormat from 'https://esm.sh/rehype-format';
import rehypeStringify from 'rehype-stringify'
import remarkSection from "./remark-section.js";
import pagedPolyfill from './paged.polyfill.js?raw';
import remarkGfm from 'remark-gfm'; 
import { remarkExtendImage } from './remark-figure.js';


async function renderMarkdown(md) {
    console.time('Total Time');  // Start total timing
    console.time('Markdown Fetch & Process');


    // Convert Markdown to HTML using unified
    const htmlText = await unified()
      .use(remarkParse) // Markdown to AST
      .use(remarkGfm) // Git flavored MD
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
export const iframe = async (css, md) => {
    console.log('md', md)
    const allImportedStyles = Array.isArray(css) ? css : [css];

    const allStyles = allImportedStyles.map(style => ` <style>${style}</style>`).join('');

    const renderedHtml = await renderMarkdown(md);

    const fullHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script>${pagedPolyfill}</script>
    <script>
    class iframeRendered extends Paged.Handler {

    afterRendered(pages) {
        window.parent.postMessage("iframeRendered", "*")
    }
    }

    Paged.registerHandlers(iframeRendered);

    </script>
    ${allStyles.trim()}
</head>
<body >
   ${renderedHtml.value.trim()}
</body>
</html>
`;

const safeDataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(fullHtmlContent);

const econdedIframe = `<iframe width="100%" height="100%" src="${safeDataUrl}"></iframe>`;

 // FIX 2: Use Blob instead of Data URI
// This gives the iframe the same "localhost" origin as your app, allowing fonts to load.
const blob = new Blob([fullHtmlContent], { type: 'text/html' });
const blobUrl = URL.createObjectURL(blob);

// Return the iframe using the Blob URL
// Note: We don't need to encodeURIComponent the URL itself, it's already safe.
const encodedIframe = `<iframe width="100%" height="100%" src="${blobUrl}" style="border:none;"></iframe>`;

return encodedIframe;;

}