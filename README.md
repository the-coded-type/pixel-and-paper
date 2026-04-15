# Pixel and Paper v.0.0.1 📄✨
---
A Markdown + CSS to PDF editor and previewer built for web typography.

## What is Pixel and Paper?

P&P lets you turn Markdown and CSS files into paginated content and export them as print-ready PDFs. It is built on [Paged.js](http://www.pagedjs.org) and JavaScript, bringing web typography tools to physical page design.

**Why use it?** If you write in Markdown but want to publish physical books, zines, or any formatted PDFs, P&P bridges the gap. Instead of using proprietary design software like InDesign or word processors, you can use the web technologies you already know (MD(HTML)/CSS) to layout print-ready documents.

It is available in two versions:

* 🌐 **Web**
  * Edit Markdown + CSS directly in the browser.
  * Preview and export PDFs in the browser.
  * Can be used locally or online.
* 💻 **Desktop**
  * Edit Markdown + CSS in the text editor of your choice (Obsidian, VS Code, etc.).
  * Preview and export PDFs in the browser via a local server.
  * Can be used only locally.

## Getting Started 🚀

### Prerequisites
* **Node.js** (v20+ recommended) to run the local servers.
* A recent version of **Google Chrome** (required for accurate PDF rendering, and file loading/saving in the web version).

### Installation
Clone the repository and install the dependencies:

```
git clone https://github.com/the-coded-type/pixel-and-paper.git
cd pixel-and-paper
npm install
```

### Running the App

**Web Version:**
* Use the live online version at [pixelppr.com](https://pixelppr.com/)
* Run it locally: `npm run dev:web`
* Build for production: `npm run build:web`
* Navigate tabs via buttons or with `option key` + `left arrow` / `right arrow`
* `option key` + `shift` opens the PDF Preview window

**Desktop Version:**
* Run locally: `npm run dev:desktop path/to/your-work-folder` 
* (Replace `path/to/your-work-folder` with the folder containing your Markdown and CSS files).
* Open `http://localhost:8080` in **Chrome**
* *GENERATE PDF* button opens the print dialog and allows to save as PDF

### Generate PDFs

* *GENERATE PDF* button opens the prit dialog and allows to save as PDF
* In the print dialog select **margins:custom** and if needed **allow background graphics**

### Using Templates
If you just want to explore P&P, use one of the templates available in the `/templates` folder:

* **Demo:** Works with the web and desktop versions.
* **Starter:** Works with the desktop version.

The template CSS files contain documentation/comments

## Differences and Limitations ⚖️

#### Web Version
* Accepts only remote images via URL.

#### Desktop Version
* Accepts both remote and local images.
* Local images must be located in `/your-work-folder` or its subfolders.
* Supports subfolders.
* Accepts `.js` files (useful for passing Paged.js plugins).
* **Note on file watching:** The desktop version watches for file changes in `/your-work-folder`, but file changes in subdirectories are not automatically detected yet. If you update a file inside a subfolder, you need to manually refresh the webpage.

## How it Works: Markdown and CSS 🛠️

### File Sorting
Before parsing, source files are sorted in alphanumeric order, including files in subfolders. The simplest way to order your files sequentially is to number them (e.g., `01-intro.md`, `02-chapter.md`). See the examples in `/templates`.

### Supported Markdown
* Standard Markdown
* GitHub Flavored Markdown
* **Images with Captions:** Images containing titles `![ALT](/img.jpg "Image Title")` are parsed into `<figure>` elements with a `<figcaption>`.
* **Section Wrapping:** P&P wraps each heading and its following content in a section tag automatically. 
  * *Example:* `# My heading` is wrapped in `<section class="my-heading my-heading-1 d-1"></section>`.

## Roadmap 🗺️

* Watch recursive plugin (subfolder watching)
* Local images support for Web version
* Interface plugin (hide/show margins, crop marks, etc.)
* Markdown file selector (render specific file vs. all files)
* Paged.js render caching
* Prettier typography control

## Support and Contributing 🤝
If you run into bugs or have a feature request, please open an issue on GitHub. Pull requests are always welcome!

## License
Pixel and Paper is released under the [MIT license](/LICENSE.md).

## Maintainer
I'm IKO, a web developer and zine publisher. 

* Mastodon [@iko@mastodon.design](https://mastodon.design/@iko)
* Bluesky [@thelostbaystudio.com](https://bsky.app/profile/thelostbaystudio.com)
* Blog: [The Coded Type](https://www.thecodedtype.com/)
* Portfolio: [Atelier Effe](https://www.ateliereffe.com/)

## More documentation on PagedJS

https://ashok-khanna.medium.com/beautiful-pdfs-from-html-9a7a3c565404

https://pagedjs.org/en/documentation/