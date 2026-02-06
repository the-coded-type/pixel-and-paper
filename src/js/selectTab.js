import { INTERFACE } from './state.js';

export const selectTab = (id) => {
    const allTabs = document.querySelectorAll(".tab");
    const allSelectors = document.querySelectorAll(".tab-selector");

    // Remove active from old
    allTabs.forEach((t) =>
        t.classList.replace("active", "inactive"),
    );
    allSelectors.forEach((s) =>
        s.classList.replace("active", "inactive"),
    );

    const targetTab = document.querySelector(`.tab[data-id="${id}"]`);
    console.log("targetTab", targetTab)

    const targetSelector = document.querySelector(`.tab-selector[data-id="${id}"]`);

    if (targetTab && targetSelector) {
        targetTab.classList.replace("inactive", "active");
        targetSelector.classList.replace("inactive", "active",);

        // Here is the problem we are trying to modify something like a state
        INTERFACE.activeTabIndex = parseInt(id);

        // CRITICAL: Tell CodeMirror to refresh its layout when shown
        console.log("SelectTab.js : targetTab", targetTab)
        targetTab.focus();
    }
};