/**
 * Initializes the application's file cache for the Pixel and Paper Desktop Editor.
 *
 * This module scans the user's specified work directory, filters for valid content,
 * and pre-loads the application state. It performs the following operations:
 * 1. Scans for `.md` and `.css` files.
 * 2. Sorts files to ensure consistent chapter ordering.
 * 3. Reads CSS content directly into the cache.
 * 4. Compiles Markdown content to HTML (via `renderMarkdown`) before caching.
 * 5. Loads the Paged.js polyfill for preview rendering.
 *
 * @module initCache
 * @async
 *
 * @param {Map<string, string>} fileCache - The Map object used to store file contents (Key: filename, Value: content).
 * @param {Array<string>} [allCssFiles] - Placeholder array for CSS filenames.
 * @param {Array<string>} [allMdFiles] - Placeholder array for Markdown filenames.
 * @param {string} workFolder - The absolute path to the user's working directory.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - fileCache: The populated Map.
 * - allCssFiles: Sorted list of CSS filenames found.
 * - allMdFiles: Sorted list of Markdown filenames found.
 */
    
    import path from 'path';
    import fs from 'fs/promises';
    import { fileURLToPath } from 'url';
    import { renderMarkdown } from '../core/src/markdown/iframeHtml.js';

    // Takes a work folder
    // Returns iframeHtmlContent
    export const initCache = async (fileCache, allCssFiles, allMdFiles, allJsFiles, workFolder) => {

        console.log(`📂 Loading files from: ${path.resolve(workFolder)}`);

        // const allWorkFiles = await fs.readdir(workFolder);
        // Recursive file loading
        // ⚠️ Watcher doesn't watch files in subdirectories

        const dirents = await fs.readdir(workFolder, {recursive: true, withFileTypes: true });

        const allWorkFiles = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => {
            const relativeDir = path.relative(workFolder, dirent.parentPath);
            return path.join(relativeDir, dirent.name);
        });
        
        allCssFiles = allWorkFiles.filter(f => f.endsWith('.css')).sort((a, b) => a.localeCompare(b));

        allMdFiles = allWorkFiles.filter(f => f.endsWith('.md')).sort((a, b) => a.localeCompare(b));

        // Adding JS support
        allJsFiles = allWorkFiles.filter(f => f.endsWith('.js')).sort((a, b) => a.localeCompare(b));

        const readCssPromises = allCssFiles.map(async file => {
            const content = await fs.readFile(path.join(workFolder, file), 'utf-8');
            fileCache.set(file, content)
        });

        const readMdPromises = allMdFiles.map(async file => {
            const rawContent = await fs.readFile(path.join(workFolder, file), 'utf-8');
            const mdContent = await renderMarkdown(rawContent);
            fileCache.set(file, mdContent)
        });

        const jsLoadingPromise = (async () => {
    
            // Map the filenames to Promises that return the script string
            const jsPromises = allJsFiles.map(async (file) => {
                const rawContent = await fs.readFile(path.join(workFolder, file), 'utf-8');
                // FIX: Use closing tag </script> and return the string
                return `<script data-filename="${file}">${rawContent}</script>`;
            });
        
            // Wait for all files to be read
            const processedJs = await Promise.all(jsPromises);
        
            // Join them and store in cache
            fileCache.set("allJsContent", processedJs.join('\n'));
        })();

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
            polyFillPromise,    // Wait for Polyfill
            jsLoadingPromise,   // Wait for JS files
        ]);

        console.log("✅ Cache initialized.", allCssFiles);


        return {fileCache, allCssFiles, allMdFiles, allJsFiles};
    }