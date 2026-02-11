import { uistate } from "@core/uistate";

// NB this module doesn't manage fail

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
