import { iframe } from "./iframe.js";

const interfaceCss = '';
let css = '';
let md = '';



tabSelectors.forEach(tabSelector => {
    tabSelector.addEventListener("click", (e) => {
        selectTab(e.target.dataset.id);
    })
});

const allEditableTabs = document.querySelectorAll('.editable-tab');

async function updatePreview() {
    const previewTab = document.getElementById("preview");

    const css = [...allEditableTabs].filter(editableTab => editableTab.dataset.type === 'css').map(editableTab => editableTab.textContent).join('');
    const md = [...allEditableTabs].filter(editableTab => editableTab.dataset.type === 'md').map(editableTab => editableTab.textContent).join('');
    previewTab.innerHTML = await iframe(css, (md));
}

allEditableTabs.forEach(editableTab => {
    editableTab.addEventListener("input", (event) => {
       updatePreview();
       // Prism.highlightElement(editableTab)

     })
})


window.addEventListener("load", () => {    
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
            const key = event.key;
            const metaKey = event.metaKey;
            const altKey = event.altKey;
            // selectTab
    
            if (!altKey) return;
    
            if (key == "Shift" ) {
                selectTab(tabsCount-1)
                return
            }
    
            if (key == "ArrowRight" ) {
                const selectedTab =  activeTabIndex == tabsCount-1 ? 0 : activeTabIndex+1;
                selectTab(selectedTab);
                return
            }

            if (key == "ArrowLeft" ) {
                const selectedTab =  activeTabIndex == 0 ? tabsCount-1 : activeTabIndex-1;
                selectTab(selectedTab);
                return
            }
    
        })

// toggle