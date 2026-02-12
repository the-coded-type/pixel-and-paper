import { loadFiles } from "./loadFiles.js";
import { WebSocketServer } from 'ws';


export const updatePdfPreview = async (workFolder, targetWs) => {
    if (targetWs.readyState !== targetWs.OPEN) return;

    try {
        console.log("Compiling preview...");
        const iframeHtmlContent = await loadFiles(workFolder);
        // We send binary data instead of a blob because a blob only lives in the process memory
        const byteData = Buffer.from(iframeHtmlContent, 'utf-8');
        targetWs.send(byteData);
        console.log("Sent preview update.");
    } catch (error) {
        console.error("Failed to update preview:", error);
    }


}