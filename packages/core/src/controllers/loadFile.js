// Simple file loader
export const loadFile = async (filePath) => {
  try {
    // Request the file from the server
    const response = await fetch(filePath);
    if (response.headers.get("content-type").includes("image")) {
      // Convert image file response to blob
      return await response.blob();
    } else {
      // Convert the response to text
      return await response.text();
    }
  } catch (err) {
    console.error("Error reading file:", err);
  }
};
