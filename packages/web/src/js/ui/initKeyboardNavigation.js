import { uistate } from '../../../../core/src/uistate.js';
import { selectTab } from './selectTab.js';

export const initKeyboardNavigation = () => {
document.addEventListener("keydown", (event) => {
    // ArrowRight
    const key = event.key;
    const metaKey = event.metaKey;
    const altKey = event.altKey;
    // selectTab

    if (!altKey) return;

    if (key == "Shift" ) {
        selectTab(uistate.tabsCount-1)
        return
    }

    if (key == "ArrowRight" ) {
        const selectedTab =  uistate.activeTabIndex == uistate.tabsCount-1 ? 0 : uistate.activeTabIndex+1;
        selectTab(selectedTab);
        return
    }

    if (key == "ArrowLeft" ) {
        const selectedTab =  uistate.activeTabIndex == 0 ? uistate.tabsCount-1 : uistate.activeTabIndex-1;
        selectTab(selectedTab);
        return
    }

})
}