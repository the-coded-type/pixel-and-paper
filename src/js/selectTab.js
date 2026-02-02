import { INTERFACE } from './state.js';

export const selectTab = (id) => {
    const allTabs = document.querySelectorAll(".tab");
    const allSelectors = document.querySelectorAll(".tab-selector");

    // Remove active from old
    allTabs.forEach((t) =>
        t.classList.replace("active", "inactive"),
    );
    allSelectors.forEach((s) =>
        s.classList.replace("active-tab", "inactive-tab"),
    );

    const targetTab = document.querySelector(`.id-${id}`);
    const targetSelector = document.querySelector(
        `[data-id="${id}"]`,
    );

    if (targetTab && targetSelector) {
        targetTab.classList.replace("inactive", "active");
        targetSelector.classList.replace(
            "inactive-tab",
            "active-tab",
        );
        // Here is the problem we are trying to modify something like a state
        INTERFACE.activeTabIndex = parseInt(id);

        // CRITICAL: Tell CodeMirror to refresh its layout when shown
        allTabs[id]?.focus();
    }
};