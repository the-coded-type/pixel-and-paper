import {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "native-file-system-adapter";

export type ProjectFileType = {
  name: string;
  path: string;
  content: string | Blob;
  fileHandle?: FileSystemFileHandle | false;
  extension?: TextExtType | ImageExtType;
};

type TextExtType = "md" | "css"; // the keys you expect
type ImageExtType = "jpg" | "jpeg" | "png" | "gif" | "webp" | "svg";

export const allowedTextExtensions: TextExtType[] = ["md", "css"];
export const allowedImageExtensions: ImageExtType[] = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
];

export class ProjectData {
  handle: FileSystemDirectoryHandle | false = false;
  md: ProjectFileType[] = [];
  css: ProjectFileType[] = [];
  images: Record<string, ProjectFileType> = {};
  orderDeduper: ReturnType<typeof setTimeout> | false = false;
  constructor() {}
  reset(): void {
    this.handle = false;
    this.md = [];
    this.css = [];
    this.images = {};
  }
  sort(): void {
    this.css.sort((a, b) => a.name.localeCompare(b.name));
    this.md.sort((a, b) => a.name.localeCompare(b.name));
  }
  store(data: ProjectFileType | ProjectFileType[]): void {
    const projectFiles = Array.isArray(data) ? data : [data];
    for (const file of projectFiles) {
      const newFile: ProjectFileType = {
        name: file.name,
        path: file.path,
        content: file.content ? file.content : "",
        fileHandle: file.fileHandle,
        extension: file.extension
          ? file.extension
          : (file.path
              .toLowerCase()
              .substring(file.path.lastIndexOf(".") + 1)
              .toLowerCase() as TextExtType | ImageExtType),
      };
      if (allowedTextExtensions.includes(newFile.extension as TextExtType)) {
        this[newFile.extension as TextExtType].push(newFile);
        this[newFile.extension as TextExtType].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        this.sort();
      } else if (
        allowedImageExtensions.includes(newFile.extension as ImageExtType)
      ) {
        this.images[newFile.path] = newFile;
      }
    }
  }
}
