import { INTERFACE } from './state.js';

export function triggerPrint() {
    // 1. Get the container (preview1)
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