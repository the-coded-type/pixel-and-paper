import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";

/*
export const CONFIG = [
    { type: "css", name: "Page", data: ["page.css"] },
    { type: "css", name: "Setup", data: ["setup.css"] },
    { type: "css", name: "Interface", data: ["interface.css"] },
    { type: "css", name: "Variables", data: ["variables.css"] },
    { type: "css", name: "Typography", data: ["typogrphy.css"] },
    { type: "css", name: "Structure", data: ["structure.css"] },
    { type: "md", name: "Intro", data: ["intro.md"] },
    { type: "md", name: "Body", data: ["body.md"] },

];
*/


export const projectData = {
    handle: '', // Where are files stored
    md: [],
    css: [],
    images: {}, // Key: "media/filename.jpg", Value: "blob:..."
};

export const BASE_PATH = "/data/";

export const languageMap = {
    css: css,
    md: markdown,
};