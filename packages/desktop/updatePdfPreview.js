import { WebSocketServer } from 'ws';
import { iframeHtml } from '../core/src/markdown/iframeHtml.js';


export const updatePdfPreview = async (fileCache, allCssFiles, allMdFiles, workFolder, targetWs) => {
    if (targetWs.readyState !== targetWs.OPEN) return;

    console.log("allHtmlFiles", allMdFiles)

    try {
        console.log("Compiling preview...");

        const allCssContent = allCssFiles.map( fileName => fileCache.get(fileName)).join('\n');

        const allHtmlContentt = allMdFiles.map( fileName => fileCache.get(fileName)).join('\n');

        const pagedPolyfillContent = fileCache.get("pagedPolyfillContent");

        const iframeHtmlContent = await iframeHtml(allCssContent, '', pagedPolyfillContent, allHtmlContentt);
        
        // We send binary data instead of a blob because a blob only lives in the process memory
        const byteData = Buffer.from(iframeHtmlContent, 'utf-8');

        targetWs.send(byteData);
        
        console.log("Sent preview update.");

    } catch (error) {
        console.error("Failed to update preview:", error);
    }


}