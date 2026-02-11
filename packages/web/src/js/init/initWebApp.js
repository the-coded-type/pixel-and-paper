import { initApp } from "../../../../core/src/init/initApp"
import { initWebAppUi } from "./initWebAppUi"

export const initWebApp = async () => {
    await initApp(initWebAppUi);
}