import { createButton } from "@core/ui/createButton";
import { initKeyboardNavigation } from "./initKeyboardNavigation";
import { updatePreviewInWebApp } from "./updatePreviewInWebApp";
import { createNewProject } from "../init/createNewProject";
import { loadProjectDirectory } from "../io/loadProjectDirectory";
import { initApp } from "../../../../core/src/init/initApp";
import { projectData } from "@core/config";
import { initWebApp } from "../init/initWebApp";
/**
 * Creates a "New Project" button and attaches the initialization logic.
 * * When clicked, this button attempts to create a new project structure via `createNewProject`.
 * If successful, it proceeds to load that directory, initialize the application state,
 * setup navigation, and render the initial preview.
 * @param {HTMLElement|string} container - The DOM element or ID where the button should be appended.
 * @param {string} [className] - Optional CSS class names to apply to the button.
 * @param {string} [id] - Optional ID for the button element.
 * @param {string} [text] - The label text for the button.
 * @returns {HTMLButtonElement|undefined} The created button element, or undefined if the container was not found.
 */
export const createNewDirectoryButton = (container, className, id, text) => {
    const createNewDirectoryButtonElement = createButton(container, className, id, text);

    if (createNewDirectoryButtonElement) {
        createNewDirectoryButtonElement.addEventListener("click", async () => {
            // Attempt to create the new project structure
            const success = await createNewProject();

            // Only proceed with loading/init if creation was successful
            if (success) {
                document.body.style.cursor = "wait";
                try {
                    await loadProjectDirectory();
                    await initWebApp;
                    initKeyboardNavigation();
                    updatePreviewInWebApp();
                } catch (error) {
                    console.error("Error initializing new project:", error);
                } finally {
                    document.body.style.cursor = "default";
                }
            }
        });
    }

    return createNewDirectoryButtonElement;
}