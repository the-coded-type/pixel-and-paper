import { uistate } from '@core/uistate.js';
import { initiPrintHandler } from '@core/controllers/printHandler.js';
import { renderUi } from '../../../web/src/js/ui/renderUi.js';
//////////// TODO
// Better naming of the dom elements
// - must be consistent between buttons and tabs
// - better click/navigation handling

//////////// INIT FUNCTION
//////////// Init loads projectData, which should be passed as an argument
//////////// projectData contains array of CSS and array of MD 
export const initApp = async (initAppUiStrategy) => {

    if (initAppUiStrategy) {
        // We initialize the app UI specific to the particular app, if it exists
        initAppUiStrategy();
    }

    console.log("uistate.tabsContainer", uistate.tabsContainer)


    // Creating preview divs (two preview divs, as we do double buffering)
    const container = document.createElement("div");
    container.className = `tab inactive preview-container   `;
    container.id = "pdf-preview-container";
    uistate.allTabs.push(container.id);

    const preview1 = document.createElement("div");
    preview1.className = `tab-content preview-tab visible`;
    preview1.id = "preview1";

    const preview2 = document.createElement("div");
    preview2.className = `tab-content preview-tab hidden`;
    preview2.id = "preview2";

    // Append preview divs to their container
    container.appendChild(preview1);

    container.appendChild(preview2);

    console.log("container", container)


    uistate.tabsContainer?.append(container);

    // We update the uistate assigning the two preview tabs
    Object.assign(uistate, {activePreview: preview1}, {previewBuffer: preview2});

    //// INIT NAVIGATION /////
    uistate.tabsCount = document.querySelectorAll('.tab').length;

    uistate.activeTab = container.id;
    uistate.previewTab = container.id;
    
    // Render UI
    renderUi();

    // Init Print Handler
    initiPrintHandler();

}