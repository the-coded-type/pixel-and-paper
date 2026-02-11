import { uistate } from "@core/uistate.js";

/**
 * Aggregates content from all active web editor tabs.
 * @note This module does not handle error states (e.g., missing tabs or view states).
 * @returns {Object} { cssContent: string, mdContent: string }
 */
export const getWebEditorContent = () => {


    // 1. Get CSS
    const cssContent = uistate.allEditorTabs
    .filter(tab => tab.lang === 'css')
    .map(tab => tab.view.state.doc.toString())
    .join("\n");

    // 2. Get Markdown
    const mdContent = uistate.allEditorTabs
    .filter(tab => tab.lang === 'md')
    .map(tab => tab.view.state.doc.toString())
    .join("\n");

    return { cssContent, mdContent }
}
