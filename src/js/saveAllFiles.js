import { projectData } from './config.js';
import { saveFileToDisk } from './saveFileToDisk.js';
import { INTERFACE } from './state.js';

export const saveAllFiles = () => {
    // Need to read all the tabs
    // Get all the content
    // Assign all the content to files
    const saveList = async (list) => {
        for (const listItem of list) {
            if (!listItem.handle) continue; // won't save files that haven't been loaded
            saveFileToDisk(listItem)
        }
    }

    const allFiles = [...projectData.css, ...projectData.md]; // array of all files
    for (let id = 0; id < allFiles.length; id++) {
        allFiles[id].content =  INTERFACE.allTabs[id].state.doc.toString();
        console.log("allFiles", allFiles)
    }
    saveList(allFiles);

}