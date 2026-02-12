    import { readTextFile } from './readTextFile.js';
    import { iframeHtml } from '../core/src/markdown/iframeHtml.js';
    import path from 'path';
    import fs from 'fs/promises'; // ✅ This is the Promise version
    import { fileURLToPath } from 'url';
    import { promises } from 'fs'; 


    // Takes a work folder
    // Returns iframeHtmlContent
    export const loadFiles = async (workFolder) => {

        // const workFolder = process.argv[2];

        console.log(`📂 Loading files from: ${path.resolve(workFolder)}`);

        // Check if files folder exists
        /*
        // Doesn't work with promises, rewrite error catching
        if (!fs.existsSync(workFolder)) {
            console.error(`❌ Error: The folder "${workFolder}" does not exist.`);
            return { css: [], md: [] }; // Return empty data
        };
        */

        /*
        const allWorkFiles = fs.readdir(workFolder).map(fileName => {
            return path.join(workFolder, fileName);
        });
        */

        const allWorkFiles = await fs.readdir(workFolder);
        
        const allCssFiles = allWorkFiles.filter(f => f.endsWith('.css')).sort((a, b) => a.localeCompare(b));

        const allMdFiles = allWorkFiles.filter(f => f.endsWith('.md')).sort((a, b) => a.localeCompare(b));
        
        /*
        const allCssContent = allCssFiles.map( f => readTextFile(f) ).join("\n");

        const allMdContent = allMdFiles.map( f => readTextFile(f) ).join("\n");
        */

        const readCssPromises = allCssFiles.map(file => {
            return fs.readFile(path.join(workFolder, file), 'utf-8');
        });

        const readMdPromises = allMdFiles.map(file => {
            return fs.readFile(path.join(workFolder, file), 'utf-8');
        });

        // 1. Recreate __dirname (since you are in a module)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // 2. Resolve the path to the polyfill file
        const polyfillPath = path.join(__dirname, '../core/src/markdown/paged.polyfill.js');

        const readPolyfillPromise = fs.readFile(polyfillPath, 'utf-8');


        const [allCssContent, allMdContent, pagedPolyfill] = await Promise.all([
            Promise.all(readCssPromises), // Wait for ALL CSS files
            Promise.all(readMdPromises),  // Wait for ALL MD files
            readPolyfillPromise           // Wait for Polyfill
        ]);

        const iframeHtmlContent = await iframeHtml(allCssContent, allMdContent, pagedPolyfill);

        return iframeHtmlContent;
    }