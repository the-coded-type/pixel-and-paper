import { updatePreview } from "@core/main/updatePreview";
import { getWebEditorContent } from "./getWebEditorContent";

export const updatePreviewInWebApp = () => {
    updatePreview(getWebEditorContent);
}