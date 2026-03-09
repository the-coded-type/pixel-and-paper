import { updatePreview } from "@core/main/updatePreview";
import { getWebEditorContent } from "./getWebEditorContent";
import { iframeHtml } from "@core/markdown/iframeHtml.js";
import pagedPolyfill from "@core/markdown/paged.polyfill.js?raw";
import { projectData } from "@core/config.js";

let latestRenderId = 0;

export const updatePreviewInWebApp = async () => {
  // 1. Generate a unique ID for this specific run
  const currentRenderId = ++latestRenderId;

  const { cssContent, mdContent } = getWebEditorContent();
  const images = projectData.images;
  const fullHtmlContent = await iframeHtml(
    cssContent,
    mdContent,
    images,
    pagedPolyfill,
    "",
    "",
  );

  // Use Blob (instead of Data URI)
  // Allows to bypass double and single quote escaping
  const blob = new Blob([fullHtmlContent], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);

  // Return the iframe using the Blob URL
  const encodedIframe = `<iframe width="100%" height="100%" src="${blobUrl}" style="border:none;"></iframe>`;

  // 2. Before updating the preview, check if a newer render started while we were working
  if (currentRenderId === latestRenderId) {
    updatePreview(encodedIframe);
  } else {
    console.log("Discarding stale preview render");
  }
};
