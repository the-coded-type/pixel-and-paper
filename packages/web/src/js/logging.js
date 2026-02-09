const defaultLog =  console.log;
const defaultErrorLog = console.error;

const display = (text) => {
    const logger = document.getElementById("log");
    logger.innerText = text; 
}

export const initLogger = () => {

    console.log = (...args) => {
        defaultLog(args);
    
        try {
            display(...args);
        } catch (e) {
            // Use originalLog here if something breaks, to avoid loops
            defaultErrorLog("Custom logger failed:", e);
        }
    }

    console.error = (...args) => {
        defaultErrorLog(args);
    
        try {
            display(...args);
        } catch (e) {
            // Use originalLog here if something breaks, to avoid loops
            defaultErrorLog("Custom logger failed:", e);
        }
    }

}
