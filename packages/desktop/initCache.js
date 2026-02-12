    import { readTextFile } from './readTextFile.js';
    import { iframeHtml } from '../core/src/markdown/iframeHtml.js';
    import path from 'path';
    import fs from 'fs/promises'; // ✅ This is the Promise version
    import { fileURLToPath } from 'url';
    import { renderMarkdown } from '../core/src/markdown/iframeHtml.js';


    // Takes a work folder
    // Returns iframeHtmlContent
    export const initCache = async (fileCache, allCssFiles, allMdFiles, workFolder) => {

        // const workFolder = process.argv[2];

        // Map.set(key, value);

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
        
        allCssFiles = allWorkFiles.filter(f => f.endsWith('.css')).sort((a, b) => a.localeCompare(b));

        allMdFiles = allWorkFiles.filter(f => f.endsWith('.md')).sort((a, b) => a.localeCompare(b));

        console.log("allMdFiles", allMdFiles)
        
        /*
        const allCssContent = allCssFiles.map( f => readTextFile(f) ).join("\n");

        const allMdContent = allMdFiles.map( f => readTextFile(f) ).join("\n");
        */

        const readCssPromises = allCssFiles.map(async file => {
            const content = await fs.readFile(path.join(workFolder, file), 'utf-8');
            fileCache.set(file, content)
        });

        const readMdPromises = allMdFiles.map(async file => {
            const rawContent = await fs.readFile(path.join(workFolder, file), 'utf-8');
            const mdContent = await renderMarkdown(rawContent);
            fileCache.set(file, mdContent)
        });

        // 1. Recreate __dirname (since you are in a module)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // 2. Resolve the path to the polyfill file
        const polyfillPath = path.join(__dirname, '../core/src/markdown/paged.polyfill.js');

        const polyFillPromise = (async () => {
            const pagedPolyfillContent = await fs.readFile(polyfillPath, 'utf-8');
            fileCache.set("pagedPolyfillContent", pagedPolyfillContent);
        })();


        await Promise.all([
            ...readCssPromises, // Wait for ALL CSS files
            ...readMdPromises,  // Wait for ALL MD files
            polyFillPromise           // Wait for Polyfill
        ]);

        console.log("✅ Cache initialized.");

        return {fileCache, allCssFiles, allMdFiles};
    }