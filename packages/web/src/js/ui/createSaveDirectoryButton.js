import { createButton } from "@core/ui/createButton.js";
import { saveAllFiles } from "../io/saveAllFiles.ts";

export const createSaveDirectoryButton = (container, className, id, text) => {
  const createSaveDirectoryButtonElement = createButton(
    container,
    className,
    id,
    text,
  );

  if (createSaveDirectoryButtonElement) {
    createSaveDirectoryButtonElement.addEventListener("click", async () => {
      console.log("Saving project...");
      await saveAllFiles();
    });
  }

  return createSaveDirectoryButtonElement;
};
