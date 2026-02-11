import { updatePreview } from "@core/main/updatePreview";
import { getWebEditorContent } from "./getWebEditorContent";
import { iframe } from '@core/markdown/iframe.js';

let latestRenderId = 0;

export const updatePreviewInWebApp = async () => {
    // 1. Generate a unique ID for this specific run
    const currentRenderId = ++latestRenderId;

    const { cssContent, mdContent } = getWebEditorContent();
    const renderedIframeHtml = await iframe(cssContent, mdContent);

    // 2. Before updating the preview, check if a newer render started while we were working
    if (currentRenderId === latestRenderId) {
        updatePreview(renderedIframeHtml);
    } else {
        console.log("Discarding stale preview render");
    }
}