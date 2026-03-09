import { createButton } from "@core/ui/createButton.js";
import { initKeyboardNavigation } from "./initKeyboardNavigation.js";
import { updatePreviewInWebApp } from "./updatePreviewInWebApp.js";
import { initWebApp } from "../init/initWebApp.js";
import FileSystem from "../io/fileSystem.js";
import { createNewProject } from "../init/createNewProject.js";

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
  const createNewDirectoryButtonElement = createButton(
    container,
    className,
    id,
    text,
  );

  if (createNewDirectoryButtonElement) {
    createNewDirectoryButtonElement.addEventListener("click", async () => {
      document.body.style.cursor = "wait";
      projectData.reset();
      projectData.handle = await FileSystem.pickDirectory(true);
      await createNewProject();
      await initWebApp();
      initKeyboardNavigation();
      updatePreviewInWebApp();
      document.body.style.cursor = "default";
    });
  }

  return createNewDirectoryButtonElement;
};
