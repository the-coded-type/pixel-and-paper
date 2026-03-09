import { projectData } from "@core/config.js";
import { type ProjectFileType } from "@core/ProjectData";
import { uistate } from "@core/uistate.js";
import { fileSystem } from "./fileSystem";

export const saveAllFiles = async () => {
  // Ask for a directory if none is configured

  if (!projectData.handle) {
    await fileSystem.pickDirectory(true);
  }
  // Need to read all the tabs
  // Get all the content
  // Assign all the content to files
  const saveList = async (list: ProjectFileType[]) => {
    if (projectData.handle) {
      try {
        for (const projectFile of list) {
          if (!projectFile.fileHandle) continue; // won't save files that haven't been loaded
          await fileSystem.save(
            projectFile.path,
            projectFile.content,
            projectData.handle,
          );
        }
      } finally {
        console.log("Project saved!");
      }
    }
  };

  const allFiles = [...projectData.css, ...projectData.md]; // array of all files
  console.log(allFiles);
  for (let id = 0; id < allFiles.length; id++) {
    allFiles[id].content = uistate.allEditorTabs[id].view.state.doc.toString();
  }
  saveList(allFiles);
};
