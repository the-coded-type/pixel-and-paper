import { unified } from 'https://esm.sh/unified';
import remarkParse from 'https://esm.sh/remark-parse';
import remarkRehype from 'https://esm.sh/remark-rehype';
import rehypeFormat from 'https://esm.sh/rehype-format';
import rehypeStringify from 'https://esm.sh/rehype-stringify';

async function renderMarkdown(md) {
    console.time('Total Time');  // Start total timing
    console.time('Markdown Fetch & Process');


    // Convert Markdown to HTML using unified
    const htmlText = await unified()
      .use(remarkParse) // Markdown to AST
      .use(remarkRehype) // AST to HTML
      .use(rehypeFormat) // Pretty print HTML
      .use(rehypeStringify) // Convert AST to string
      .process(md); // Wait for this step to complete

      console.timeEnd('Markdown Fetch & Process'); // End time for markdown fetch and processing

        return  htmlText;
  }

export const iframe = async ([css], md) => {

    const allImportedStyles = Array.isArray(css) ? css : [css];

    const allStyles = allImportedStyles.map(style => ` <style>${style}</style>`).join('');

    const renderedHtml = await renderMarkdown(md);
return `
<iframe width="100%" height="100%" srcdoc='
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
    <style>
        @page { size: A5; margin: 20mm; border: 1px solid #ccc; }
        body { font-family: sans-serif; background: #333; }
        .pagedjs_pages { display: flex; flex-direction: column; align-items: center; }
        .pagedjs_page { background: white; margin: 10px; }
    </style>
    <style>
    ${allStyles}
    </style>
</head>
<body>
   ${renderedHtml}
</body>
</html>
'></iframe>
`}