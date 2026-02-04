
import { iframe } from './iframe.js';
import { INTERFACE } from './state.js';


export const updatePreview = async () => {

    const previewTab = INTERFACE.activePreview;
    const bufferTab = INTERFACE.previewBuffer;

    if (!previewTab) return;

    // 1. Get CSS
    const cssContent = Object.keys(INTERFACE.allTabs)
        .filter((id) => {
            const container = document.getElementById(
                `container-${id}`,
            );
            // Safety: Check if INTERFACE.allTabs[id] exists AND has the class
            return (
                INTERFACE.allTabs[id] &&
                container?.classList.contains("language-css")
            );
        })
        .map((id) => INTERFACE.allTabs[id].state.doc.toString()) // Now safe
        .join("\n");

    // 2. Get Markdown
    const mdContent = Object.keys(INTERFACE.allTabs)
        .filter((id) => {
            const container = document.getElementById(
                `container-${id}`,
            );
            // Safety: Check if INTERFACE.allTabs[id] exists AND has the class
            return (
                INTERFACE.allTabs[id] &&
                container?.classList.contains("language-md")
            );
        })
        .map((id) => INTERFACE.allTabs[id].state.doc.toString()) // Now safe
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
                    internalIframeWindow.scroll({top: INTERFACE.preview.lastScroll, behavior: "instant"} );
                    bufferTab.classList.replace("hidden", "visible");
                    previewTab.classList.replace("visible", "hidden");

                    INTERFACE.activePreview = bufferTab;
                    INTERFACE.previewBuffer = previewTab;

                    console.log('Preview PDF updated.')
                }                            
            })

            
            internalIframeWindow.addEventListener("scroll", (event) => {
                INTERFACE.preview.lastScroll = internalIframeWindow.scrollY;
        })

    }
    }
    
}