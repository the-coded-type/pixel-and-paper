import {
  showDirectoryPicker as showDirectoryPickerPonyFill,
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "native-file-system-adapter";
import { allowedTextExtensions, type ProjectFileType } from "@core/ProjectData";

export class FileSystem {
  private _directory: FileSystemDirectoryHandle | false = false;
  get directory(): FileSystemDirectoryHandle | false {
    return this._directory;
  }
  private _supported: Boolean = false;
  get supported(): Boolean {
    return this._supported;
  }

  constructor() {
    if ("showDirectoryPicker" in window) {
      this._supported = true;
    }
  }

  private async _walkDirectory(
    directoryHandle: FileSystemDirectoryHandle,
    path: string = "",
  ): Promise<ProjectFileType[]> {
    const projectFiles = [];
    // recursively load files from directory and sub directory
    try {
      for await (const entry of directoryHandle.values()) {
        const relativePath = path ? `${path}/${entry.name}` : entry.name;
        if (entry.kind === "file") {
          const fileHandle = entry as FileSystemFileHandle;
          // load file content
          const storeFile = await this.openFile(fileHandle);
          // collect files to return
          if (storeFile) {
            storeFile.path = relativePath;
            projectFiles.push(storeFile);
          }
        } else if (entry.kind === "directory") {
          const subDirectoryHandle = (await directoryHandle.getDirectoryHandle(
            entry.name,
          )) as FileSystemDirectoryHandle;
          // Recurse into subfolders (like "media")
          await this._walkDirectory(subDirectoryHandle, relativePath);
        }
      }
    } catch (err) {
      console.error("Error loading directory:", err);
      throw err;
    }
    return projectFiles;
  }

  private _download(fileName: string, content: string | Blob): void {
    // Save file to user download directory
    const blob =
      content instanceof Blob
        ? content
        : new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async pickDirectory(
    needWriteAccess: Boolean = false,
  ): Promise<FileSystemDirectoryHandle | false> {
    if (this._supported || !needWriteAccess) {
      // Run ponyfill to give unsupported browsers ability to read folder
      try {
        const directoryHandle = await showDirectoryPickerPonyFill({
          _preferPolyfill: false,
          ...{
            id: "pixel-and-paper",
            mode: "readwrite",
          },
        });
        this._directory = directoryHandle;
        return directoryHandle;
      } catch (err) {
        console.log("User cancelled picker", err);
      }
    }
    return false;
  }

  async openFile(
    fileHandleOrPath: FileSystemFileHandle | string,
    directoryHandle: FileSystemDirectoryHandle | false = this._directory,
  ): Promise<ProjectFileType | false> {
    let localDirectoryHandle = directoryHandle;
    let fileHandle: FileSystemFileHandle | false = false;
    let filePath = "";

    // handle fileHandleOrPath as path and convert to FileSystemFileHandle
    if (typeof fileHandleOrPath === "string") {
      if (!localDirectoryHandle) {
        // NOTE: Should we really handle this or just return false
        localDirectoryHandle = await this.pickDirectory();
        if (!localDirectoryHandle) {
          return false;
        }
      }
      filePath = fileHandleOrPath;
      fileHandle = (await localDirectoryHandle.getFileHandle(filePath, {
        create: true,
      })) as FileSystemFileHandle;
      if (!fileHandle || typeof fileHandle === "string") {
        return false;
      }
    } else {
      fileHandle = fileHandleOrPath;
    }
    if (fileHandle) {
      // load file content
      const file = await fileHandle.getFile();
      // TODO: Handle failed getFile
      if (!file) {
        return false;
      }
      // populate store file object
      const storeFile: ProjectFileType = {
        name: file.name,
        path: file.webkitRelativePath + file.name,
        fileHandle: fileHandle,
        content: file,
      };
      // If it's a text file, convert content to text
      if (
        allowedTextExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext),
        )
      ) {
        storeFile.content = await file.text();
      }
      return storeFile;
    } else {
      // Handle user cancel
      return false;
    }
  }

  async openDirectory(
    directoryHandle: FileSystemDirectoryHandle | false = this._directory,
    path: string = "",
  ): Promise<ProjectFileType[]> {
    if (directoryHandle) {
      const projectFiles = await this._walkDirectory(directoryHandle, path);
      return projectFiles;
    } else {
      return [];
    }
  }

  private async _createOrOverwriteFile(
    fileName: string,
    content: string | Blob,
    directoryHandle: FileSystemDirectoryHandle | false = this._directory,
  ) {
    if (directoryHandle) {
      const fileHandle = (await directoryHandle.getFileHandle(fileName, {
        create: true,
      })) as FileSystemFileHandle;

      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return fileHandle;
    }
    return false;
  }

  /**
   * Saves a file using the File System API to a specific location
   */
  async saveAs(fileName: string, content: string | Blob) {
    if ("showSaveFilePicker" in window) {
      try {
        const fileHandle = await (
          window as unknown as Window & { showSaveFilePicker: Function }
        ).showSaveFilePicker({
          suggestedName: fileName,
        });

        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return fileHandle;
      } catch (err) {
        // User cancelled
        console.error("User cancelled", err);
        return;
      }
    }
    // Fallback: download the file
    this._download(fileName, content);
  }

  /**
   * Saves a file using the File System API with a fallback to download
   */
  async save(
    fileName: string,
    content: string | Blob,
    directoryHandle?: FileSystemDirectoryHandle,
  ): Promise<void> {
    // If directoryHandle is provided, save directly to that folder
    if (directoryHandle) {
      try {
        await this._createOrOverwriteFile(fileName, content, directoryHandle);
        return;
      } catch (err) {
        console.error("Failed to save file to directory:", err);
        // Fall through to fallback
      }
    }

    // If no directoryHandle is provided, try saveAs
    await this.saveAs(fileName, content);
  }
  // NOTE: Should we add a function to save a whole project to a new directory? saveDirectoryAs()?
}

export const fileSystem = new FileSystem();
