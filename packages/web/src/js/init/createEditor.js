import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import { markdown } from '@codemirror/lang-markdown'
import { gruvboxDark } from '@fsegurai/codemirror-theme-gruvbox-dark'
import { languageMap } from "@core/config.js";

export const createEditor = (lang = "md", startText = "", parent, onUpdate) => {

    const langFn = languageMap[lang];
    
    const view = new EditorView({
        doc: startText,
        parent: parent || document.body,
        extensions: [
            basicSetup,
            langFn(), /// either markdown(), or css() or sometthing else
            gruvboxDark, // theme
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
                if (update.docChanged && onUpdate) {
                    console.log("Typing...")
                    onUpdate();
                }
            })
        ]
    })

    return {view: view, lang: lang};
}