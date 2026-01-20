console.log('main');

import { iframe } from "./iframe.js";
import { interfaceCss } from "./interface.css.js"

let css = '';

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

const tabPdf = document.getElementById("tab-pdf");

function updatePdf(styles) {
    tabPdf.innerHTML = iframe(styles);
}

tabCss.addEventListener("input", (event) => {
    css = tabCss.textContent;
    updatePdf([css, interfaceCss]);
 })

 function init() {
    tabCss.textContent = interfaceCss;
    css = tabCss.textContent;
    updatePdf([css, interfaceCss]);
 }

 window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    init();
  });

// toggle