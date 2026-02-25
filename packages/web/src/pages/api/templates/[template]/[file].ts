import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function GET({
  params: { template, file },
}: {
  params: { template: string; file: string };
}) {
  // Validate file extension
  const allowedExtensions = [
    ".md",
    ".css",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
  ];
  if (
    !file ||
    !allowedExtensions.some((ext) => file.toLowerCase().endsWith(ext))
  ) {
    return new Response("Only .md, .css, and common image files are allowed", {
      status: 403,
    });
  }

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const templateBase = path.resolve(
    currentDir,
    `../../../../../../templates/${template}/`,
  );
  const filePath = path.join(templateBase, file);

  // Prevent path traversal attacks
  if (!filePath.startsWith(templateBase)) {
    return new Response("Access denied", { status: 403 });
  }

  try {
    const data = await fs.readFile(filePath);

    let contentType = "application/octet-stream";
    const lowerFile = file.toLowerCase();

    if (lowerFile.endsWith(".css")) {
      contentType = "text/css";
    } else if (lowerFile.endsWith(".md")) {
      contentType = "text/markdown";
    } else if (lowerFile.endsWith(".jpg") || lowerFile.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerFile.endsWith(".png")) {
      contentType = "image/png";
    } else if (lowerFile.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (lowerFile.endsWith(".webp")) {
      contentType = "image/webp";
    } else if (lowerFile.endsWith(".svg")) {
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
