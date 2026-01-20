console.log('main');

import { iframe } from "./iframe.js";
import { interfaceCss } from "./interface.css.js"

let css = '';
let md = '';

const tabs = document.querySelectorAll(".tab");

const tabSelectors = document.querySelectorAll('.tab-selector');

let activeTab = tabs[0];

tabSelectors.forEach(tabSelector => {
    tabSelector.addEventListener("click", (e) => {
        selectTab(e.target.dataset.id);
    })
});

const selectTab = id => {
    activeTab.classList.toggle("active");    // remove class from active tab
    activeTab.classList.toggle("inactive");
    activeTab = tabs[id];          // update active tab
    activeTab.classList.toggle("inactive");
    activeTab.classList.toggle("active");    // add class from active tab
};

const tabCss = document.getElementById("tab-css");

const tabMd = document.getElementById("tab-md");

const tabPdf = document.getElementById("tab-pdf");

async function updatePdf(styles, md) {
    md = tabMd.textContent;
    tabPdf.innerHTML = await iframe(styles, md);
}

tabCss.addEventListener("input", (event) => {
    md = tabMd.textContent;
    css = tabCss.textContent;
    updatePdf([css, interfaceCss], md);
 })

 tabMd.addEventListener("input", (event) => {
    md = tabMd.textContent;
    css = tabCss.textContent;
    updatePdf([css, interfaceCss], md);
 })

 function init() {
    tabCss.textContent = interfaceCss;
    md = tabMd.textContent;
    css = tabCss.textContent;
    updatePdf([css, interfaceCss]);
 }

 window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    init();
  });

// toggle