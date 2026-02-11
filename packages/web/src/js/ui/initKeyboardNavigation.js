import { uistate } from '@core/uistate.js';
import { renderUi } from './renderUi.js';

export const initKeyboardNavigation = () => {
document.addEventListener("keydown", (event) => {
    // ArrowRight
    const key = event.key;
    const metaKey = event.metaKey;
    const altKey = event.altKey;
    // selectTab

    if (!altKey) return;

    if (key == "Shift" ) {
        uistate.activeButton = uistate.previewButton;
        uistate.activeTab = uistate.previewTab,
        renderUi();
    }

    if (key == "ArrowRight" ) {
        const currentButtonIndex = uistate.allTabSelectors.indexOf(uistate.activeButton);
        const newButtonIndex = currentButtonIndex == uistate.allTabSelectors.length-1 ? 0 : currentButtonIndex+1;


        uistate.activeButton = uistate.allTabSelectors[newButtonIndex];
        uistate.activeTab = uistate.allTabs[newButtonIndex];
        renderUi();
    }

    if (key == "ArrowLeft" ) {
        const currentButtonIndex = uistate.allTabSelectors.indexOf(uistate.activeButton);
        const newButtonIndex = currentButtonIndex == 0 ? uistate.allTabSelectors.length-1 : currentButtonIndex-1;

        uistate.activeButton = uistate.allTabSelectors[newButtonIndex];
        uistate.activeTab = uistate.allTabs[newButtonIndex];
        renderUi();
    }

})
}