import { createEditor } from './createEditor.js';
import { uistate } from '@core/uistate.js';
import { updatePreviewInWebApp } from '../ui/updatePreviewInWebApp.js';

const debounce = function () {
    let editorTimeout;
    const debounceTimeout = () => {
        if (editorTimeout) {
            clearTimeout(editorTimeout)
        }
        editorTimeout = setTimeout(updatePreviewInWebApp, 400)
    }
    return debounceTimeout
}

const debounceUpdateIframe = debounce();

// The name of this function is misleading, it should rather be createNewTab
export const createNewTab = (_id, lang, content, className) => {
    const container = document.createElement("div");
    container.className = `tab language-${lang} ${className}`;
    container.id = `tab-${_id}`;

    uistate.tabsContainer?.append(container);

    uistate.allEditorTabs[_id] = {id: container.id, ...createEditor(lang, content, container, debounceUpdateIframe)};
    uistate.allTabs.push(container.id);

    // We should probably return the updated uistate
    //return container;
}