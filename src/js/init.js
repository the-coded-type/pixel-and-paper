import { createNewTab } from './createNewTab.js';
import { selectTab } from './ui/selectTab.js';
import { INTERFACE } from './state.js';
import { initiPrintHandler } from './ui/printHandler.js';
//////////// TODO
// Better naming of the dom elements
// - must be consistent between buttons and tabs
// - better click/navigation handling

//////////// INIT FUNCTION
//////////// Init loads DATA, which should be passed as an argument
export const initApp = async (projectData) => {
    INTERFACE.tabsContainer = document.getElementById("tabs");

    // DATA arrays contains all css and md projectData
    const DATA = [...projectData.css, ...projectData.md]

    //// Creation of the navigation container
    const nav = document.getElementById("nav");
    INTERFACE.tabsContainer = document.getElementById("tabs");
    
    INTERFACE.tabsContainer.innerHTML = ''; 
    nav.innerHTML = '';

    // CREATE NAVIGATION
    // One button for each file loaded
    // Button labels are filenames without extentsion
    DATA.forEach((d, index) => {
        const btn = document.createElement("button");
        const lang = d.name.split('.').pop() || '';
        // Add classes and text
        btn.className = `tab-selector tab-${lang} ${index === 0 ? "active" : "inactive"}`;
        btn.dataset.id = index;
        btn.innerText = d.name.toUpperCase();
        btn.style.marginRight = "2em";

        // Attach listener
        // On click selectTab
        // TODO: Passing the index is error prone and not a great strategy
        // I should pass a ref to the button itself
        btn.addEventListener("click", () => {
            selectTab(index);
        });

        // Append to DOM, to nav
        nav.appendChild(btn);
    });

    // ADD PDF PREVIEW BUTTON MANUALLY
    const pdfPreviewBtn = document.createElement("button");
    pdfPreviewBtn.className = "tab-selector tab-preview inactive";
    pdfPreviewBtn.dataset.id = DATA.length;
    pdfPreviewBtn.innerText = "S.PDF PREVIEW";
    pdfPreviewBtn.addEventListener("click", () => {
        // TODO: same as above
        // Passing the index is error prone and not a great strategy
        // I should pass a ref to the button itself
        selectTab(DATA.length);
    });
    nav.appendChild(pdfPreviewBtn);

    // Creation of the tabs containing the editors and the pdf preview
    DATA.forEach((d, index) => {
        const className = index == 0 ? "active" : "inactive";
        const lang = d.name.split('.').pop() || 'md';
        createNewTab(index, lang, d.content, className);
    });

    INTERFACE.tabsCount = DATA.length+1; 
    // +1 because there is one additional tab for the PDF preview

    // Creating preview divs (two preview divs, as we do double buffering)
    const container = document.createElement("div");
    container.className = `tab inactive preview-container   `;
    container.dataset.id = DATA.length

    const preview1 = document.createElement("div");
    preview1.className = `tab-content preview-tab visible`;
    preview1.id = "preview1";

    
    const preview2 = document.createElement("div");
    preview2.className = `tab-content preview-tab hidden`;
    preview2.id = "preview2";

    // Append preview divs to their container
    container.appendChild(preview1);

    container.appendChild(preview2);

    INTERFACE.tabsContainer?.append(container);

    // We update the INTERFACE assigning the two preview tabs
    Object.assign(INTERFACE, {activePreview: preview1}, {previewBuffer: preview2});


    //// INIT NAVIGATION /////
    const tabSelectors = document.querySelectorAll(".tab-selector");

    // Init Print Handler
    initiPrintHandler();

}