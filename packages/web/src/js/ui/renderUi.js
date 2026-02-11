import { uistate } from '@core/uistate.js';

export const renderUi = () => {

    // all tabs + all selectors set inactive / active
    const allTabs = document.querySelectorAll(".tab");
    const allSelectors = document.querySelectorAll(".tab-selector");

    allSelectors.forEach((s) =>{
        if (uistate.activeButton == s.id) {
            s.classList.add("active");
            s.classList.remove("inactive");
        }else {
            s.classList.add("inactive");
            s.classList.remove("active");
        }    
    });

    allTabs.forEach((t) =>{
        if (uistate.activeTab == t.id) {
            t.classList.add("active");
            t.classList.remove("inactive");

        }else {
            t.classList.add("inactive");
            t.classList.remove("active");
        }  
    });

}