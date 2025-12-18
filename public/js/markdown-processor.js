// Import required dependencies
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirectives from 'remark-directives';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

async function initializeMarkdownProcessor() {
  // Create the processor pipeline
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirectives)
    .use(remarkRehype)
    .use(rehypeStringify);

  return processor;
}

async function loadMarkdown(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return await response.text();
  } catch (error) {
    console.error('Error loading markdown:', error);
    throw error;
  }
}

async function processMarkdown(markdownText) {
  const processor = await initializeMarkdownProcessor();
  try {
    const result = await processor.process(markdownText);
    return result.toString();
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
}

function injectIntoDOM(htmlContent, targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  if (!targetElement) {
    throw new Error(`Target element with id "${targetElementId}" not found`);
  }
  
  targetElement.innerHTML = htmlContent;
}

async function initializePagedJS() {
  try {
    // Wait for DOM to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize paged.js
    window.PagedPolyfill.initialize();
  } catch (error) {
    console.error('Error initializing paged.js:', error);
  }
}

// Main initialization function
async function initializeMarkdownPage(markdownUrl, targetElementId) {
  try {
    // Load and process markdown
    const markdown = await loadMarkdown(markdownUrl);
    const html = await processMarkdown(markdown);
    
    // Inject into DOM
    injectIntoDOM(html, targetElementId);
    
    // Initialize paged.js
    await initializePagedJS();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}