import { projectData } from "@core/config.js";
import { uistate } from "@core/uistate.js";
import { fileSystem } from "../io/fileSystem";

export const saveAllFiles = async () => {
  // Ask for a directory if none is configured

  if (!projectData.handle) {
    fileSystem.pickDirectory(true);
  }

  // Need to read all the tabs
  // Get all the content
  // Assign all the content to files
  const saveList = async (list) => {
    try {
      for (const listItem of list) {
        if (!listItem.fileHandle) continue; // won't save files that haven't been loaded
        console.log("Save file");
        await fileSystem.save(listItem);
      }
    } finally {
      console.log("Project saved!");
    }
  };

  const allFiles = [...projectData.css, ...projectData.md]; // array of all files
  for (let id = 0; id < allFiles.length; id++) {
    allFiles[id].content = uistate.allEditorTabs[id].view.state.doc.toString();
  }
  saveList(allFiles);
};
