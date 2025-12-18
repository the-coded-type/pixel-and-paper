// @ts-check
import { defineConfig } from 'astro/config';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype'; // <-- Import remarkRehype

import rehypeCustomDirectives from './src/lib/rehype-custom-directives.js';


// https://astro.build/config
export default defineConfig({
  build: {
    // Customize Vite build config here
    vite: {
      build: {
        minify: false, // Disable JS minification
      },
      css: {
        minify: false, // Disable CSS minification
      },
    },
  },
  markdown: {
    // 2. Add remarkAttr to the `remarkPlugins` array
    remarkPlugins: [
      remarkGfm,
      // Add remarkRehype here with the passThrough option
      [remarkRehype, { passThrough: ['containerDirective', 'leafDirective', 'textDirective'] }],
      remarkDirective // It's important that remarkDirective is *before* remarkRehype
                      // so remark-directive creates the nodes that remark-rehype can then pass through.
    ],
    rehypePlugins: [
      rehypeCustomDirectives // Your custom plugin will now find the passed-through directives
    ],
  },
 
});
