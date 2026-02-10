import { uistate } from '@core/uistate.js';
import { projectData } from '@core/config.js';
import { createNewTab } from './createNewTab.js';
//import { selectTab } from '../ui/selectTab.js';
import { renderUi } from '../ui/renderUi.js';

export const initWebAppUi = () => {
     uistate.tabsContainer = document.getElementById("tabs");
    
        // DATA arrays contains all css and md projectData
        const DATA = [...projectData.css, ...projectData.md]
    
        //// Creation of the navigation container
        const nav = document.getElementById("nav");
        uistate.tabsContainer = document.getElementById("tabs");
        
        uistate.tabsContainer.innerHTML = ''; 
        nav.innerHTML = '';
    
        // CREATE TABS NAVIGATION
        // One button for each file loaded
        // Button labels are filenames without extentsion
        DATA.forEach((d, index) => {
            const btn = document.createElement("button");
            const lang = d.name.split('.').pop() || '';
            // Add classes and text
            btn.className = `tab-selector tab-${lang} ${index === 0 ? "active" : "inactive"}`;
            btn.id = `tab-selector-${index}`;
            btn.innerText = d.name.toUpperCase();
            btn.style.marginRight = "2em";
            btn.dataset.target = `tab-${index}`;
    
            // Attach listener
            // On click selectTab
            // TODO: Passing the index is error prone and not a great strategy
            // I should pass a ref to the button itself
            btn.addEventListener("click", () => {
                uistate.activeButton = btn.id;
                uistate.activeTab = btn.dataset.target;
                renderUi();
            });
    
            // Append to DOM, to nav
            nav.appendChild(btn);
        });
    
        // TABS CREATION
        // Creation of the tabs containing the editors and the pdf preview
        DATA.forEach((d, index) => {
            const className = index == 0 ? "active" : "inactive";
            const lang = d.name.split('.').pop() || 'md';
            createNewTab(index, lang, d.content, className);
        });
    
}