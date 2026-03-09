import { projectData, templateData } from "@core/config.js";
import FileSystem from "../io/fileSystem.js";

// Copy template files
async function saveTemplateFiles(templateFiles, directoryHandle) {
  return Promise.all(
    templateFiles.map(async (templateFile) => {
      const file = {
        name: templateFile.filename,
        content: templateFile.content,
        path: templateFile.filename,
      };
      if (FileSystem.supported) {
        await FileSystem.save(file.name, file.content, directoryHandle);
      }
      projectData.store(file);
      return file;
    }),
  );
}

export async function createNewProject() {
  try {
    // Get Template data
    const templates = await templateData("Starter Template");
    if (!templates || templates.length === 0) {
      console.error("No templates loaded. Check /data/ path.");
      return false;
    }
    await saveTemplateFiles(templates, projectData.handle);
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("User cancelled folder selection.");
      return null;
    }
    console.error("Error loading directory:", err);
    throw err;
  }
}
