import { languageMap } from "../config.js";
import { createEditor } from './createEditor.js';
import { INTERFACE } from '../state.js';
import { updatePreview } from "../updatePreview.js";

const debounce = function () {
    let editorTimeout;
    const debounceTimeout = () => {
        if (editorTimeout) {
            clearTimeout(editorTimeout)
        }
        editorTimeout = setTimeout(updatePreview, 400)
    }
    return debounceTimeout
}

const debounceUpdateIframe = debounce();

// The name of this function is misleading, it should rather be createNewTab
export const createNewTab = (_id, lang, content, className) => {
    const container = document.createElement("div");
    container.className = `tab language-${lang} ${className}`;
    container.dataset.id = _id;

    INTERFACE.tabsContainer?.append(container);

    const langFn = languageMap[lang];

    INTERFACE.allTabs[_id] = createEditor(langFn(), content, container, debounceUpdateIframe);
    // We should probably return the updated INTERFACE
    //return container;
}