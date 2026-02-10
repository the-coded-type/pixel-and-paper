import { initApp } from "./initApp"
import { initWebAppUi } from "./initWebAppUi"

export const initWebApp = async () => {
    await initApp(initWebAppUi);
}