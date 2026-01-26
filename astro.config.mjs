// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import remarkFigure from './public/js/lib/remark-figure.js';

import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';


import remarkSection from './public/js/lib/remarkSection.js';

import remarkDirectiveRehype from './public/js/lib/rehype-custom-directives.js';


// https://astro.build/config
export default defineConfig({
  build: {
    // Customize Vite build config here
    
  },
  markdown: {
    // 2. Add remarkAttr to the `remarkPlugins` array
    remarkPlugins: [

    ],
    rehypePlugins: [
    ]
  },
 
});
