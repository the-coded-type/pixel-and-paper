console.log('===== Main =====');

import { iframe } from "./iframe.js";

const interfaceCss = '';
let css = '';
let md = '';

const tabs = document.querySelectorAll(".tab");

const tabsCount = tabs.length;

const tabSelectors = document.querySelectorAll('.tab-selector');

console.log('tabSelectors', tabSelectors)

let activeTab;

let activeTabSelector;

let activeTabIndex;

const selectTab = id => {
    activeTab.classList.toggle("active");    // remove class from active tab
    activeTab.classList.toggle("inactive");
    activeTabSelector.classList.toggle("active-tab");    // remove class from active tab
    activeTabSelector.classList.toggle("inactive-tab");

    activeTab = tabs[parseInt(id)];          // update active tab
    activeTabSelector = tabSelectors[id];          // update active tab
    activeTabIndex = parseInt(id);

    activeTab.classList.toggle("inactive");
    activeTab.classList.toggle("active");    // add class from active tab
    activeTabSelector.classList.toggle("inactive-tab");
    activeTabSelector.classList.toggle("active-tab");    // add class from active tab

    console.log("selectTab activeTabIndex, id", activeTabIndex, id)
    console.log("selectTab activeTab", activeTab)
    console.log("selectTab activeTabSelector", activeTabSelector)
};

tabSelectors.forEach(tabSelector => {
    tabSelector.addEventListener("click", (e) => {
        console.log("click event, active tab",activeTabIndex, "clicked", e.target.dataset.id);
        console.log("Click event, id clicked ", e.target.dataset.id)
        selectTab(e.target.dataset.id);
    })
});

const allEditableTabs = document.querySelectorAll('.editable-tab');

const previewTab = document.getElementById("preview");

async function updatePreview() {
    const css = [...allEditableTabs].filter(editableTab => editableTab.dataset.type === 'css').map(editableTab => editableTab.textContent).join('');
    const md = [...allEditableTabs].filter(editableTab => editableTab.dataset.type === 'md').map(editableTab => editableTab.textContent).join('');
    previewTab.innerHTML = await iframe(css, (md));
}

allEditableTabs.forEach(editableTab => {
    editableTab.addEventListener("input", (event) => {
       updatePreview();
     })
})


window.addEventListener("load", () => {
    console.log("main: page is fully loaded");
    
    // CORRECTED: No arguments needed here
    updatePreview(); 
    activeTabIndex = 7;
    activeTab = tabs[activeTabIndex];
    activeTabSelector = tabSelectors[activeTabIndex];
    activeTab.classList.toggle("inactive");
    activeTab.classList.toggle("active");
    activeTabSelector.classList.toggle("active-tab");
    activeTabSelector.classList.toggle("inactive-tab");
});

         // Interaction
    
         document.addEventListener("keydown", (event) => {
            // ArrowRight
            console.log(event)
            const key = event.key;
            const metaKey = event.metaKey;
            // selectTab
    
            if (!metaKey) return;
    
            if (key == "Shift" ) {
                selectTab(tabsCount-1)
                return
            }
    
            if (key == "ArrowRight" ) {
                console.log("ArrowRight")
                const selectedTab =  activeTabIndex == tabsCount-1 ? 0 : activeTabIndex+1;
                console.log("selectedTab", selectedTab);
                selectTab(selectedTab);
                return
            }
    
        })

// toggle