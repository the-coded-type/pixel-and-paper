import { projectData } from './config.js';
import { templateData } from './config.js';
import { clearProjectData } from './clearProjectData.js';

export async function createNewProject() {
    clearProjectData();
    try {
        // 1. Fetch the templates from server/public folder
        // We do this BEFORE asking the user, to ensure we have data ready.
        const templates = await templateData(); 
        
        if (!templates || templates.length === 0) {
            console.error("No templates loaded. Check /data/ path.");
            return false;
        }

        // 2. Ask user to pick the destination folder
        const dirHandle = await window.showDirectoryPicker({
            mode: 'readwrite' 
        });

        // 3. Reset State (Clear old project data)
        projectData.handle = dirHandle;
        projectData.md.length = 0;
        projectData.css.length = 0;
        // Clear images safely
        Object.keys(projectData.images).forEach(key => delete projectData.images[key]);

        // 4. Helper to write to disk AND update state
        const writeAndRegister = async (fileItem) => {
            // A. Create the file on the user's disk
            // We use fileItem.filename (e.g., "page.css")
            const fileHandle = await dirHandle.getFileHandle(fileItem.filename, { create: true });
            
            // B. Write the content
            const writable = await fileHandle.createWritable();
            await writable.write(fileItem.content);
            await writable.close();

            // C. Create the state object
            const stateObject = {
                name: fileItem.filename,
                path: fileItem.filename,
                content: fileItem.content,
                handle: fileHandle // Store handle for future Saves
            };

            // D. Sort into correct array in projectData
            if (fileItem.type === 'css') {
                projectData.css.push(stateObject);
            } else if (fileItem.type === 'md') {
                projectData.md.push(stateObject);
            }
        };

        // 5. Execute all writes in parallel
        await Promise.all(templates.map(writeAndRegister));

        console.log("New project created from template.");
        return true;

    } catch (err) {
        if (err.name === 'AbortError') return false; // User cancelled
        console.error("Error creating project:", err);
        return false;
    }
}