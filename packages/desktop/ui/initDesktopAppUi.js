/**
 * Initializes the User Interface for the Desktop Application.
 *
 * @module ui/init
 */

import { uistate } from '@core/uistate.js';

export const initDesktopAppUi = () => {
    uistate.tabsContainer = document.getElementById("tabs");
}