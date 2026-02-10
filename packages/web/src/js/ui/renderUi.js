import { uistate } from '@core/uistate.js';

export const renderUi = () => {
    console.log("uistate.activeButton", uistate.activeButton);

    // all tabs + all selectors set inactive / active
    const allTabs = document.querySelectorAll(".tab");
    const allSelectors = document.querySelectorAll(".tab-selector");

    allSelectors.forEach((s) =>{
        if (uistate.activeButton == s.id) {
            s.classList.replace("inactive", "active");
        }else {
            s.classList.replace("active", "inactive");
        }    
    });

    allTabs.forEach((t) =>{
        if (uistate.activeTab == t.id) {
            t.classList.replace("inactive", "active");
        }else {
            t.classList.replace("active", "inactive");
        }  
    });


}