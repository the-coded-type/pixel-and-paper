
import { iframe } from '../../../core/src/markdown/iframe.js';
import { uistate } from '../../../core/src/uistate.js';


export const updatePreview = async () => {

    const previewTab = uistate.activePreview;
    const bufferTab = uistate.previewBuffer;

    if (!previewTab) return;

    // 1. Get CSS
    const cssContent = Object.keys(uistate.allTabs)
        .filter((id) => {
            const container = document.querySelector(`.language-css[data-id="${id}"]`);
            // Safety: Check if uistate.allTabs[id] exists AND has the class
            return (
                uistate.allTabs[id] &&
                container?.classList.contains("language-css")
            );
        })
        .map((id) => uistate.allTabs[id].state.doc.toString()) // Now safe
        .join("\n");

    // 2. Get Markdown
    const mdContent = Object.keys(uistate.allTabs)
        .filter((id) => {
            const container = document.querySelector(`.language-md[data-id="${id}"]`);
            // Safety: Check if uistate.allTabs[id] exists AND has the class
            return (
                uistate.allTabs[id] &&
                container?.classList.contains("language-md")
            );
        })
        .map((id) => uistate.allTabs[id].state.doc.toString()) // Now safe
        .join("\n");

    // 3. Update the iframe
    // we postpone that the buffer takes it first
    // previewTab.innerHTML = await iframe(cssContent, mdContent);

    // const iframeElement = previewTab.querySelector("iframe")

    bufferTab.innerHTML = await iframe(cssContent, mdContent);
    const iframeElement = bufferTab.querySelector("iframe")

    if (iframeElement) {
        iframeElement.onload = () => {
            const internalIframeWindow = iframeElement.contentWindow;
            
            // We check if the iframe is rendered
            // Then trannsfer its contents to the preview div
            // The message iframeRendered is fired by the window when pagedJS has finished rendering the page, it's defined in iframe.js
            window.addEventListener("message", (event) => {
                if (event.data == "iframeRendered") {
                    internalIframeWindow.scroll({top: uistate.preview.lastScroll, behavior: "instant"} );
                    bufferTab.classList.replace("hidden", "visible");
                    previewTab.classList.replace("visible", "hidden");

                    uistate.activePreview = bufferTab;
                    uistate.previewBuffer = previewTab;

                    console.log('Preview PDF updated.')
                }                            
            })

            
            internalIframeWindow.addEventListener("scroll", (event) => {
                uistate.preview.lastScroll = internalIframeWindow.scrollY;
        })

    }
    }
    
}