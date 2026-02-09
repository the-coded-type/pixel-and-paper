import { INTERFACE } from '../state.js';

export function printHandler() {
    // 1. Get the container active preview (preview1 or preview2)
    const container = INTERFACE.activePreview;
    
    if (!container) {
        console.warn("Print Error: No active preview found.");
        return;
    }

    // 2. Find the iframe inside the container
    const iframe = container.querySelector('iframe');
    
    if (iframe && iframe.contentWindow) {
        // 3. FOCUS is critical: Browsers print the "focused" frame
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    } else {
        console.warn("Print Error: Preview iframe not found.");
    }
}

export const initiPrintHandler = () => {
    window.addEventListener('keydown', (e) => {
        // Check for Command (Mac) or Control (Windows) + P
        if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
            
            // 1. Stop the browser from printing the whole interface
            e.preventDefault(); 
            
            // 2. Trigger your specific iframe print
            printHandler();
        }
    });
};