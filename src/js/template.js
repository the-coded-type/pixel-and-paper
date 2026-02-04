export const DEFAULT_PROJECT = {
    md: [
        {
            name: "1_intro.md",
            content: `# My super booklet

Booklet template by IKO.


Credit: NASA/NOAA/GSFC/Suomi NPP/VIIRS/Norman Kuring`
        },
        {
            name: "2_body.md",
            content: `## Chapter 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* List item 1
* List item 2
* List item 3

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

## Chapter 2

**Lorem ipsum dolor sit amet.**

> Form and function are one.

Frank Lloyd Wright

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`
        }
    ],
    css: [
        {
            name: "1_page.css",
            content: `/* ==========================================================================
   PAGE SETTINGS (PGED.JS / CSS PAGED MEDIA)
   ========================================================================== */

/**
 * 1. BASIC PAGE SETUP
 * Defines the physical size of the paper and the whitespace (margins) around the content.
 * * UNITS: For print, always use physical units:
 * - 'mm' (millimeters)
 * - 'in' (inches)
 * - 'pt' (points)
 * Avoid using 'px' as it depends on screen resolution.
 *
 * DOCS: https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size
 */

 @page { 
    /* Common standard sizes: A4, A5, Letter, Legal */
    size: A5;

    /* Margin for all four sides */
    margin: 20mm;
}


/**
 * 2. RECTO / VERSO (FACING PAGES)
 * If you are printing a book, you often need different margins for left (verso)
 * and right (recto) pages to accommodate the binding (spine).
 *
 * UNCOMMENT TO USE:
 */

/* 

@page :left {
    margin-left: 20mm;  
    margin-right: 25mm; 
}

@page :right {
    margin-left: 25mm; 
    margin-right: 20mm; 
} 
*/


/**
 * 3. PRINTER MARKS & BLEED
 * Professional printing requires 'bleed' (extending images beyond the edge) 
 * and 'crop marks' (lines showing where to cut the paper).
 *
 * UNCOMMENT TO USE:
 */

/* @page {
    bleed: 3mm; 
    marks: crop cross; 
} 
*/


/**
 * 4. PAGE MARGIN BOXES (HEADERS & FOOTERS)
 * Paged.js allows you to place content inside the margins (outside the body).
 * There are 16 specific slots available.
 * * USEFUL CONTENT:
 * - string(title)   : Variable content (like chapter titles)
 * - counter(page)   : The current page number
 * - counter(pages)  : Total page count
 * - more info on margin boxes, and diagram https://pagedjs.org/en/documentation/7-generated-content-in-margin-boxes/
 */

@page {
    
    /* --- TOP MARGINS --- */
    
    /* The intersection of Top and Left margins */
    @top-left-corner { 
        /* content: ""; */
    }

    @top-left { 
        /* content: string(chapter-title); */
    }

    @top-center { 
        /* content: "My Document Title"; */
    }

    @top-right { 
        /* content: ""; */
    }

    /* The intersection of Top and Right margins */
    @top-right-corner { 
        /* content: ""; */
    }


    /* --- BOTTOM MARGINS --- */

    @bottom-left-corner { 
        /* content: ""; */
    }

    @bottom-left { 
        /* content: ""; */
    }

    @bottom-center { 
        /* content: "- " counter(page) " -"; */
    }

    @bottom-right { 
        /* content: "Page " counter(page) " of " counter(pages); */
    }

    @bottom-right-corner { 
        /* content: ""; */
    }


    /* --- SIDE MARGINS (Vertical alignment) --- */
    /* Note: Text in side margins usually needs 'transform: rotate(-90deg)' */

    /* LEFT SIDE */
    @left-top { 
        /* content: ""; */
    }
    
    @left-middle { 
        /* content: ""; */
    }

    @left-bottom { 
        /* content: ""; */
    }

    /* RIGHT SIDE */
    @right-top { 
        /* content: ""; */
    }

    @right-middle { 
        /* content: ""; */
    }

    @right-bottom { 
        /* content: ""; */
    }
}`
        },
        {
            name: "2_setup.css",
            content: `.pagedjs_marks-crop{
    z-index: 999999999999;
  
}

.pagedjs_bleed-top .pagedjs_marks-crop, 
.pagedjs_bleed-bottom .pagedjs_marks-crop{
    box-shadow: 1px 0px 0px 0px var(--pagedjs-crop-shadow);
}  

.pagedjs_bleed-top .pagedjs_marks-crop:last-child,
.pagedjs_bleed-bottom .pagedjs_marks-crop:last-child{
    box-shadow: -1px 0px 0px 0px var(--pagedjs-crop-shadow);
}  

.pagedjs_bleed-left .pagedjs_marks-crop,
.pagedjs_bleed-right .pagedjs_marks-crop{
    box-shadow: 0px 1px 0px 0px var(--pagedjs-crop-shadow);
}

.pagedjs_bleed-left .pageborder-rightdjs_marks-crop:last-child,
.pagedjs_bleed-right .pagedjs_marks-crop:last-child{
    box-shadow: 0px -1px 0px 0px var(--pagedjs-crop-shadow);
}`
        },
        {
            name: "2_interface.css",
            content: ``
        },
        {
            name: "4_variables.css",
            content: ``
        },
        {
            name: "5_typography.css",
            content: ``
        },
        {
            name: "6_structure.css",
            content: ``
        },
    ]
};