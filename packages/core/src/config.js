import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { loadFile } from "@core/controllers/loadFile.js";

// CONFIG Defines the default project
export const TEMPLATE = [
    { type: "css", name: "Page", data: ["1_page.css"] },
    { type: "css", name: "Setup", data: ["2_setup.css"] },
    { type: "css", name: "interface", data: ["3_interface.css"] },
    { type: "css", name: "Variables", data: ["4_variables.css"] },
    { type: "css", name: "Typography", data: ["5_typography.css"] },
    { type: "css", name: "Structure", data: ["6_structure.css"] },
    { type: "md", name: "Intro", data: ["1_intro.md"] },
    { type: "md", name: "Body", data: ["2_body.md"] },
];

export const BASE_PATH = "/data/";

// Create DATA from config
export const templateData = async () => {
    const PROMISES = TEMPLATE.map(async ({ type, name, data }) => {
        const content = await loadFile(`${BASE_PATH}${data[0]}`);

        return { type: type, name: name, filename: data[0], content:content };
    });

    // DATA is an array of {type: 'type, for example css or md', data: 'string content'}
    const projectDataFromTemplate = await Promise.all(PROMISES);
    return projectDataFromTemplate;
}

export const projectData = {
    handle: '', // Where are files stored
    md: [],
    css: [],
    images: {}, // Key: "media/filename.jpg", Value: "blob:..."
};

export const languageMap = {
    css: css,
    md: markdown,
};