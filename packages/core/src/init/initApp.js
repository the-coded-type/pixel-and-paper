import { uistate } from '@core/uistate.js';
import { initiPrintHandler } from '@core/controllers/printHandler.js';
import { projectData } from '@core/config.js';
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

    // +1 because there is one additional tab for the PDF preview

        // ADD PDF PREVIEW BUTTON MANUALLY
        const pdfPreviewBtn = document.createElement("button");
        pdfPreviewBtn.className = "tab-selector tab-preview inactive";
        pdfPreviewBtn.dataset.target = "pdf-preview";
        pdfPreviewBtn.id = "pdf-preview-selector";
        pdfPreviewBtn.innerText = "S.PDF PREVIEW";
        uistate.allTabSelectors.push(pdfPreviewBtn.id);
        pdfPreviewBtn.addEventListener("click", () => {
            uistate.activeButton = pdfPreviewBtn.id;
            uistate.activeTab = pdfPreviewBtn.dataset.target;
            renderUi();
        });
        nav.appendChild(pdfPreviewBtn);

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

    uistate.tabsContainer?.append(container);

    // We update the uistate assigning the two preview tabs
    Object.assign(uistate, {activePreview: preview1}, {previewBuffer: preview2});

    //// INIT NAVIGATION /////
    uistate.tabsCount = document.querySelectorAll('.tab').length;

    uistate.activeButton = pdfPreviewBtn.id;
    uistate.activeTab = container.id;
    uistate.previewTab = container.id;
    uistate.previewButton = pdfPreviewBtn.id;

    
    // Render UI
    renderUi();

    // Init Print Handler
    initiPrintHandler();

}