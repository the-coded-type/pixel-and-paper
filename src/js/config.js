import { markdown } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";

export const CONFIG = [
    { type: "css", name: "Page", data: ["1_page.css"] },
    { type: "css", name: "Setup", data: ["2_setup.css"] },
    { type: "css", name: "Interface", data: ["3_interface.css"] },
    { type: "css", name: "Variables", data: ["4_variables.css"] },
    { type: "css", name: "Typography", data: ["5_typography.css"] },
    { type: "css", name: "Structure", data: ["6_structure.css"] },
    { type: "md", name: "Intro", data: ["1_intro.md"] },
    { type: "md", name: "Body", data: ["2_body.md"] },
];

export const BASE_PATH = "/data/";

const loadMyFile = async (filePath) => {
    try {
        // Request the file from your local server
        const response = await fetch(filePath);

        // Convert the response to text
        const content = await response.text();

        return content;
    } catch (err) {
        console.error("Error reading file:", err);
    }
};

export const templateData = async () => {
    const PROMISES = CONFIG.map(async ({ type, name, data }) => {
        const content = await loadMyFile(`${BASE_PATH}${data[0]}`);

        return { type: type, name: name, filename: data[0], content:content };
    });

    // DATA is an array of {type: 'type, for example css or md', data: 'string content'}
    const DATA = await Promise.all(PROMISES);
    return DATA;
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