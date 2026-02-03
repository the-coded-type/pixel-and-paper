import { projectData } from './config.js';
import { saveFileToDisk } from './saveFileToDisk.js';

export const saveAllFiles = () => {

    const saveList = async (list) => {
        for (const listItem of list) {
            if (!listItem.handle) continue; // won't save files that haven't been loaded
            saveFileToDisk(listItem)
        }
    }

    saveList(projectData.css);
    saveList(projectData.md);

}