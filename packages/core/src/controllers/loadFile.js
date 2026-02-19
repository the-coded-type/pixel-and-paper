// Simple file laoder
export const loadFile = async (filePath) => {
    try {
        // Request the file from the local server
        const response = await fetch(filePath);

        // Convert the response to text
        const content = await response.text();

        return content;
    } catch (err) {
        console.error("Error reading file:", err);
    }
};