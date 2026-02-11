
import { iframe } from '@core/markdown/iframe.js';
import { uistate } from '@core/uistate.js';

export const updatePreview = async (getContent) => {

    
    const previewTab = uistate.activePreview;
    const bufferTab = uistate.previewBuffer;

    if (!previewTab) return;

    // We get the cssContent
    // getContent passed as an argument is different for the webapp and the desktop app
    const { cssContent, mdContent } = getContent();
 
    // Update the iframe
    bufferTab.innerHTML = await iframe(cssContent, mdContent);
    const iframeElement = bufferTab.querySelector("iframe")

    if (iframeElement) {
        iframeElement.onload = () => {
            const internalIframeWindow = iframeElement.contentWindow;
            
            // We check if the iframe is rendered
            // Then trannsfer its contents to the preview div (and hide the other preview div)
            // The message iframeRendered is fired by the window when pagedJS has finished rendering the page, it's defined in iframe.js
            // We then scroll to the last registered scroll position
            window.addEventListener("message", (event) => {
                if (event.data == "iframeRendered") {
                    internalIframeWindow.scroll({top: uistate.preview.lastScroll, behavior: "instant"} );
                    bufferTab.classList.replace("hidden", "visible");
                    previewTab.classList.replace("visible", "hidden");

                    uistate.activePreview = bufferTab;
                    uistate.previewBuffer = previewTab;

                    console.log('Preview PDF updated.')
                }                            
            }, { once: true })

            // We register the scroll position
            internalIframeWindow.addEventListener("scroll", (event) => {
                uistate.preview.lastScroll = internalIframeWindow.scrollY;
        })

    }
    }
    
}