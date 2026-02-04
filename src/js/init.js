// import { CONFIG } from './config.js';
import { BASE_PATH } from './config.js';
import { openNewTab } from './openNewTab.js';
import { selectTab } from './selectTab.js';
import { INTERFACE } from './state.js';
import { triggerPrint } from './printHandler.js';
import { loadProjectDirectory } from './loadProjectDirectory.js';

//////////// INIT FUNCTION
//////////// Init loads DATA, which should be passed as an argument
export const initApp = async (projectData) => {
    INTERFACE.tabsContainer = document.getElementById("tabs");

    const DATA = [...projectData.css, ...projectData.md]

    //// Creation of the navigation
    const nav = document.getElementById("nav");
    INTERFACE.tabsContainer = document.getElementById("tabs");
    
    INTERFACE.tabsContainer.innerHTML = ''; 
    nav.innerHTML = '';

    // CREATE NAVIGATION
    DATA.forEach((d, index) => {
        const btn = document.createElement("button");
        const lang = d.name.split('.').pop() || '';
        // Add classes and text
        btn.className = `tab-selector tab-${lang} ${index === 0 ? "active-tab" : "inactive-tab"}`;
        btn.dataset.id = index;
        btn.innerText = d.name.toUpperCase();
        btn.style.marginRight = "2em";

        // ATTACH LISTENER DIRECTLY HERE
        btn.addEventListener("click", () => {
            selectTab(index);
        });

        // Append to DOM
        nav.appendChild(btn);
    });

    // ADD PDF PREVIEW BUTTON MANUALLY
    const pdfBtn = document.createElement("button");
    pdfBtn.className = "tab-selector tab-preview inactive-tab";
    pdfBtn.dataset.id = DATA.length;
    pdfBtn.innerText = "S.PDF PREVIEW";
    pdfBtn.addEventListener("click", () => {
        selectTab(DATA.length);
    });
    nav.appendChild(pdfBtn);

    // Creation of the tabs containing the editors and the pdf preview
    DATA.forEach((d, index) => {
        const className = index == 0 ? "active" : "inactive";
        const lang = d.name.split('.').pop() || markdown;
        openNewTab(index, lang, d.content, className);
    });

    INTERFACE.tabsCount = DATA.length+1; // +1 because there is one additional tab for the PDF preview

    const container = document.createElement("div");
    container.className = `tab inactive id-${DATA.length}`;

    const preview1 = document.createElement("div");
    preview1.className = `tab-content preview-tab visible`;
    preview1.id = "preview1";

    
    const preview2 = document.createElement("div");
    preview2.className = `tab-content  preview-tab hidden`;
    preview2.id = "preview2";

    container.appendChild(preview1);

    container.appendChild(preview2);

    INTERFACE.tabsContainer?.append(container);

    Object.assign(INTERFACE, {activePreview: preview1}, {previewBuffer: preview2});


    //// INIT NAVIGATION /////
    const tabSelectors = document.querySelectorAll(".tab-selector");



    window.addEventListener('keydown', (e) => {
        // Check for Command (Mac) or Control (Windows) + P
        if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
            
            // 1. Stop the browser from printing the whole interface
            e.preventDefault(); 
            
            // 2. Trigger your specific iframe print
            triggerPrint();
        }
    });
}