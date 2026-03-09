/**
 * Compiles and sends the updated PDF preview (HTML) to a specific WebSocket client.
 *
 * This function retrieves the pre-loaded CSS and HTML content from the `fileCache`,
 * combines them into a single HTML document (via `iframeHtml`), and streams the
 * result as binary data to the client for immediate rendering.
 *
 * Operations:
 * 1. Checks if the WebSocket connection is open.
 * 2. Aggregates CSS and HTML content from the provided file lists.
 * 3. Fetches the Paged.js polyfill from the cache.
 * 3. bis TODO this needs to be modified, the polyfill should be served as an asset by the http server
 * 4. Generates the full HTML document string.
 * 5. Converts the HTML string to a Buffer (binary) to prevent quotes/double quotes mess.
 * 6. Sends the data to the client.
 *
 * @async
 * @function updatePdfPreview
 *
 * @param {Map<string, string>} fileCache - The centralized cache containing file contents and the polyfill.
 * @param {Array<string>} allCssFiles - Sorted list of CSS filenames to include (keys for the cache).
 * @param {Array<string>} allMdFiles - Sorted list of Markdown filenames (keys for the cache).
 * @param {string} workFolder - The absolute path to the working directory (legacy, unused). TODO workFolder needs to be removed
 * @param {WebSocket} targetWs - The specific WebSocket connection to send the update to.
 *
 * @returns {Promise<void>} Returns nothing, but sends a message via WebSocket on success.
 */

import { iframeHtml } from "../core/src/markdown/iframeHtml.js";

export const updateIframeHtmlContent = async (
  fileCache,
  allCssFiles,
  allMdFiles,
  allJsFiles,
  workFolder,
  targetWs,
) => {
  if (targetWs.readyState !== targetWs.OPEN) return;

  try {
    console.log("Compiling preview...");

    const allCssContent = allCssFiles
      .map((fileName) => fileCache.get(fileName))
      .join("\n");

    const allHtmlContent = allMdFiles
      .map((fileName) => fileCache.get(fileName))
      .join("\n");

    const allImages = {};

    const pagedPolyfillContent = fileCache.get("pagedPolyfillContent");

    const jsContent = fileCache.get("allJsContent");

    const iframeHtmlContent = await iframeHtml(
      allCssContent,
      "",
      allImages,
      pagedPolyfillContent,
      allHtmlContent,
      jsContent,
    );

    // We send binary data instead of a blob because a blob only lives in the process memory
    const byteData = Buffer.from(iframeHtmlContent, "utf-8");

    targetWs.send(byteData);

    console.log("Sent preview update.");
  } catch (error) {
    console.error("Failed to update preview:", error);
  }
};
