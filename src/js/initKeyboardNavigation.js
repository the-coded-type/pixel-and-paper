import { INTERFACE } from './state.js';
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
        selectTab(INTERFACE.tabsCount-1)
        return
    }

    if (key == "ArrowRight" ) {
        const selectedTab =  INTERFACE.activeTabIndex == INTERFACE.tabsCount-1 ? 0 : INTERFACE.activeTabIndex+1;
        selectTab(selectedTab);
        return
    }

    if (key == "ArrowLeft" ) {
        const selectedTab =  INTERFACE.activeTabIndex == 0 ? INTERFACE.tabsCount-1 : INTERFACE.activeTabIndex-1;
        selectTab(selectedTab);
        return
    }

})
}