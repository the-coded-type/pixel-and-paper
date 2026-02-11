import { uistate } from '@core/uistate.js';

/**
 * Updates the preview pane using a double-buffering technique to ensure seamless transitions.
 * * @async
 * @param {string} renderedIframeHtml - The full HTML string to be injected into the preview buffer.
 * @description
 * 1. Identifies the currently hidden "buffer" tab and the currently visible "active" tab.
 * 2. Injects the new HTML into the hidden buffer.
 * 3. Waits for the internal iframe to load and for Paged.js to signal completion via postMessage.
 * 4. Swaps the visible/hidden classes to display the new content.
 * 5. Restores the previous scroll position to prevent visual jumping.
 */
export const updatePreview = async (renderedIframeHtml) => {

    const previewTab = uistate.activePreview; // The currently visible container
    const bufferTab = uistate.previewBuffer;  // The hidden container we will render into

    // Safety check: ensure we have a valid DOM element to work with
    if (!previewTab) return;
 
    // 1. Render into the Buffer
    // We inject the HTML into the hidden div. The user does not see this yet.
    bufferTab.innerHTML = renderedIframeHtml;
    const iframeElement = bufferTab.querySelector("iframe");

    if (iframeElement) {
        // 2. Wait for the Iframe Resource Load
        // This fires when the <iframe> tag has loaded its initial resources (scripts, css).
        iframeElement.onload = () => {
            const internalIframeWindow = iframeElement.contentWindow;
            
            // 3. Wait for Layout Completion (Paged.js)
            // The 'iframeRendered' message is dispatched by the iframe's internal script 
            // (e.g., Paged.js) once the heavy layout calculations are finished.
            window.addEventListener("message", (event) => {
                if (event.data === "iframeRendered") {
                    
                    // A. Restore Scroll Position
                    // We instantly jump to the last known scroll Y position so the user
                    // doesn't feel like the page reset to the top.
                    internalIframeWindow.scroll({
                        top: uistate.preview.lastScroll, 
                        behavior: "instant"
                    });

                    // B. Swap Buffers (The "Flip")
                    // Make the buffer visible and the old preview hidden.
                    bufferTab.classList.replace("hidden", "visible");
                    previewTab.classList.replace("visible", "hidden");

                    // C. Update State
                    // The buffer is now the active preview, and the old active preview becomes the new buffer.
                    uistate.activePreview = bufferTab;
                    uistate.previewBuffer = previewTab;

                    console.log('Preview PDF updated.');
                }                            
            }, { once: true }); // Important: Only listen for this specific render event once

            // 4. Track Scroll Position
            // Continuously update the state with the user's current scroll position
            // so we can restore it on the next re-render.
            internalIframeWindow.addEventListener("scroll", (event) => {
                uistate.preview.lastScroll = internalIframeWindow.scrollY;
            });
        }
    }
}