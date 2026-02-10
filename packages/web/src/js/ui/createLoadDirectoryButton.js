import { createButton } from "@core/ui/createButton.js";
import { loadProjectDirectory } from "../io/loadProjectDirectory";
import { initApp } from "../init/initApp";
import { initKeyboardNavigation } from "./initKeyboardNavigation";
import { updatePreviewInWebApp } from "./updatePreviewInWebApp";
import { projectData } from "../../../../core/src/config";
import { getWebEditorContent } from "./getWebEditorContent";
import { initWebApp } from "../init/initWebApp";
/**
 * Creates a "Load Directory" button and attaches the full application initialization sequence.
 * * When clicked, this button triggers the following async sequence:
 * 1. Sets cursor to 'wait'.
 * 2. Loads the project directory via `loadProjectDirectory`.
 * 3. Initializes the app with `projectData`.
 * 4. Sets up keyboard navigation and updates the preview.
 * 5. Resets the cursor to 'default'.
 * @param {HTMLElement|string} container - The DOM element or ID where the button will be appended.
 * @param {string} [className] - CSS class names to apply to the button.
 * @param {string} [id] - The ID for the button element.
 * @param {string} [text] - The label text for the button.
 * @returns {HTMLButtonElement|undefined} The created button element, or undefined if container is invalid.
 */

export const createLoadDirectoryButton = (container, className, id, text) => {
    const loadDirectoryButtonElement = createButton(container, className, id, text);

    if (loadDirectoryButtonElement) {
        loadDirectoryButtonElement.addEventListener("click", async () => {
            document.body.style.cursor = "wait";
            await loadProjectDirectory();
            await initWebApp();
            initKeyboardNavigation();
            updatePreviewInWebApp();
            document.body.style.cursor = "default";
        });
    }
    return loadDirectoryButtonElement;
}