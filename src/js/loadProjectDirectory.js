import { projectData } from "./config";
import { clearProjectData } from './clearProjectData.js';

// fileSystem.js

export async function loadProjectDirectory() {
    clearProjectData();
    try {
        // 1. Open the Directory Picker
        const dirHandle = await window.showDirectoryPicker();
    
        projectData.handle = dirHandle;

        // 2. Recursive Scanner
        async function scanDirectory(handle, path = "") {
            for await (const entry of handle.values()) {
                const relativePath = path ? `${path}/${entry.name}` : entry.name;

                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    
                    if (entry.name.endsWith('.md')) {
                        const content = await file.text();
                        projectData.md.push({ 
                            name: entry.name, 
                            path: relativePath,
                            content: content,
                            handle: entry // Store handle for saving later
                        });
                    } 
                    else if (entry.name.endsWith('.css')) {
                        const content = await file.text();
                        projectData.css.push({ 
                            name: entry.name, 
                            path: relativePath,
                            content: content,
                            handle: entry 
                        });
                    }
                    else if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].some(ext => entry.name.toLowerCase().endsWith(ext))) {
                        // Create a Blob URL for previewing
                        const blobUrl = URL.createObjectURL(file);
                        // Store using the relative path as the Key
                        projectData.images[relativePath] = blobUrl;
                    }
                } 
                else if (entry.kind === 'directory') {
                    // Recurse into subfolders (like "media")
                    await scanDirectory(entry, relativePath);
                }
            }
        }

        await scanDirectory(dirHandle);
        
        // Sorting css
        projectData.css.sort((a, b) => a.name.localeCompare(b.name))
        projectData.md.sort((a, b) => a.name.localeCompare(b.name))

        return projectData;

    } catch (err) {
        if (err.name === 'AbortError') {
            console.log("User cancelled folder selection");
            return null;
        }
        console.error("Error loading directory:", err);
        throw err;
    }
}