// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import remarkFigure from './src/lib/remark-figure.js';

import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';


import remarkSection from './src/lib/remark-section.js';

import remarkDirectiveRehype from './src/lib/rehype-custom-directives.js';


// https://astro.build/config
export default defineConfig({
  build: {
    // Customize Vite build config here
    
  },
  markdown: {
    // 2. Add remarkAttr to the `remarkPlugins` array
    remarkPlugins: [
      remarkDirective,       // 1. Parse ::: syntax
      remarkDirectiveRehype,  // 2. Convert to HTML <div>
      remarkSection
    ],
    rehypePlugins: [
    ]
  },
 
});
