import {basicSetup} from "codemirror"
import {EditorView} from "@codemirror/view"
import { markdown } from '@codemirror/lang-markdown'
import { css } from "@codemirror/lang-css";
import { gruvboxDark } from '@fsegurai/codemirror-theme-gruvbox-dark'
import { INTERFACE } from '../state.js';

export const createEditor = (lang = markdown(), startText = "", parent, onUpdate) => {

    const view = new EditorView({
        doc: startText,
        parent: parent || document.body,
        extensions: [
            basicSetup,
            lang, /// either markdown(), or css() or sometthing else
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

    return view;
}