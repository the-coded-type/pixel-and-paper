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

    // This function needs to check tabsContainer type
    // allTabs here is a local variable, we add the tabs to it, and then return it at the end of the function
    //

    /*
    const PROMISES = CONFIG.map(async ({ type, name, data }) => {
        const content = await loadMyFile(`${BASE_PATH}${data[0]}`);

        return { type: type, name: name, data: content };
    });
    */

    // DATA is an array of {type: 'type, for example css or md', data: 'string content'}
    // const DATA = await Promise.all(PROMISES);

    const DATA = [...projectData.css, ...projectData.md]

    console.log("DATA", DATA)

    //// Creation of the navigation
    const nav = document.getElementById("nav");
    DATA.forEach((d, index) => {
        const className =
            index == 0 ? "active-tab" : "inactive-tab";

        nav.innerHTML += `<button style="margin-right:2em;" class="tab-selector ${className}" data-id="${index}">${d.name.toUpperCase()}</button>`;
    });

    nav.innerHTML += `<button class="tab-selector inactive-tab" data-id="${DATA.length}">S.PDF PREVIEW</button>`;

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

    tabSelectors.forEach((tabSelector) => {
        tabSelector.addEventListener("click", (e) => {
            selectTab(e.target.dataset.id);
        });
    });

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