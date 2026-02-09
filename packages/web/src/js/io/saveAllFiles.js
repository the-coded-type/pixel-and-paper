import { projectData } from '../config.js';
import { saveFileToDisk } from './saveFileToDisk.js';
import { uistate } from '../../../../core/src/uistate.js';

export const saveAllFiles = () => {
    // Need to read all the tabs
    // Get all the content
    // Assign all the content to files
    const saveList = async (list) => {

        try {
            for (const listItem of list) {
                if (!listItem.handle) continue; // won't save files that haven't been loaded
                await saveFileToDisk(listItem)
            }
        }

        finally {
            console.log("Project saved!")
        }

    }

    const allFiles = [...projectData.css, ...projectData.md]; // array of all files
    for (let id = 0; id < allFiles.length; id++) {
        allFiles[id].content =  uistate.allTabs[id].state.doc.toString();
    }
    saveList(allFiles);

}