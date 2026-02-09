export async function saveFileToDisk(fileItem) {
    if (!fileItem || !fileItem.handle) {
        console.error("Cannot save: Missing file handle.", fileItem);
        return false;
    }

    try {
        // 1. Create a writable stream to the file
        // This might prompt the user for permission if it wasn't granted already
        const writable = await fileItem.handle.createWritable();

        // 2. Write the content
        await writable.write(fileItem.content);

        // 3. Close the file (This commits the changes)
        await writable.close();

        console.log(`Saved: ${fileItem.name}`);
        return true;

    } catch (err) {
        console.error(`Error saving ${fileItem.name}:`, err);
        return false;
    }
}