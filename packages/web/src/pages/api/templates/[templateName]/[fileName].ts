import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  allowedImageExtensions,
  allowedTextExtensions,
} from "@core/ProjectData";

export async function GET({
  params: { templateName = "", fileName = "forbidden.exe" },
}: {
  params: { templateName: string; fileName: string };
}) {
  // Validate file extension
  const lowerCaseFileName = fileName.toLowerCase();
  const extension = lowerCaseFileName.substring(
    lowerCaseFileName.lastIndexOf(".") + 1,
  );
  const allowedExtensions = [
    ...allowedImageExtensions,
    ...allowedTextExtensions,
  ];
  if (!allowedExtensions.some((ext) => lowerCaseFileName.endsWith(ext))) {
    return new Response("Only .md, .css, and common image files are allowed", {
      status: 403,
    });
  }

  // Encode and test file name for security
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templateBase = path.resolve(
    currentDir,
    `../../../../../../../templates/`,
  );
  const safeFileName = path.basename(fileName);
  const filePath = path.join(templateBase, templateName, safeFileName);

  // Prevent path traversal attacks
  if (!filePath.startsWith(templateBase)) {
    return new Response("Access denied", { status: 403 });
  }

  try {
    const data = await fs.readFile(filePath);

    let contentType = "application/octet-stream";

    if (lowerCaseFileName.endsWith(".css")) {
      contentType = "text/css";
    } else if (lowerCaseFileName.endsWith(".md")) {
      contentType = "text/markdown";
    } else if (
      lowerCaseFileName.endsWith(".jpg") ||
      lowerCaseFileName.endsWith(".jpeg")
    ) {
      contentType = "image/jpeg";
    } else if (lowerCaseFileName.endsWith(".png")) {
      contentType = "image/png";
    } else if (lowerCaseFileName.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (lowerCaseFileName.endsWith(".webp")) {
      contentType = "image/webp";
    } else if (lowerCaseFileName.endsWith(".svg")) {
      contentType = "image/svg+xml";
    }

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    console.error("File read error:", err);
    return new Response("File not found", { status: 404 });
  }
}
