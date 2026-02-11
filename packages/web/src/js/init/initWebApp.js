import { initApp } from "@core/init/initApp"
import { initWebAppUi } from "./initWebAppUi"

export const initWebApp = async () => {
    await initApp(initWebAppUi);
}