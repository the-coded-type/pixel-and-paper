let bleedFull = '6mm';
let cssFullSpread = `.pagedjs_page_fullLeft .pagedjs_full-spread_container{
  margin: 0;
  width: calc(var(--pagedjs-pagebox-width) + `+ bleedFull + `);
  height: calc(var(--pagedjs-pagebox-height) + `+ bleedFull + `*2);
  position: absolute;
  top: calc((var(--pagedjs-margin-top) + `+ bleedFull + `)*-1);
  left: calc((var(--pagedjs-margin-left) + `+ bleedFull + `)*-1);
}
.pagedjs_page_fullRight .pagedjs_full-spread_container{
  margin: 0;
  width: calc(var(--pagedjs-pagebox-width) + `+ bleedFull + `);
  height: calc(var(--pagedjs-pagebox-height) + `+ bleedFull + `*2);
  position: absolute;
  top: calc((var(--pagedjs-margin-top) + `+ bleedFull + `)*-1);
  left: calc(var(--pagedjs-margin-left)*-1);
}
.pagedjs_full-spread_content{
  margin: 0;
  width: calc(var(--pagedjs-pagebox-width)*2 + `+ bleedFull + `*2);
  height: calc(var(--pagedjs-pagebox-height) + `+ bleedFull + `*2);
  position: absolute;
  top: 0;
  left: 0;
}
.pagedjs_page_fullLeft .pagedjs_full-spread_content{
  left: calc(var(--pagedjs-fold)*-1);
}
.pagedjs_page_fullRight .pagedjs_full-spread_content{
  left: calc((var(--pagedjs-pagebox-width) + `+ bleedFull + `)*-1 + var(--pagedjs-fold))
}`;

let cssFullPage = `
.pagedjs_full-page_content {
  margin: 0;
  position: absolute;
  top: calc((var(--pagedjs-margin-top) + `+ bleedFull + `)*-1);
}
.pagedjs_left_page .pagedjs_full-page_content {
  width: calc(var(--pagedjs-pagebox-width) + `+ bleedFull + `);
  height: calc(var(--pagedjs-pagebox-height) + `+ bleedFull + `*2);
  left: calc((var(--pagedjs-margin-left) + `+ bleedFull + `)*-1);

}
.pagedjs_right_page .pagedjs_full-page_content {
  width: calc(var(--pagedjs-pagebox-width) + `+ bleedFull + `);
  height: calc(var(--pagedjs-pagebox-height) + `+ bleedFull + `*2);
  left: calc(var(--pagedjs-margin-left)*-1);
}
`;



class fullPageStuff extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.selectorFullSpread = new Set();
    this.fullSpreadEls = new Set();
    this.selectorFullPage = new Set();
    this.fullPageEls = new Set();
    this.selectorFullRight = new Set();
    this.fullRightEls = new Set();
    this.selectorFullLeft= new Set();
    this.fullLeftEls = new Set();
    this.usedPagedEls = new Set();
  }

  onDeclaration(declaration, dItem, dList, rule) {
    // Read customs properties
    if (declaration.property == "--pagedjs-full-page") {
      // get selector of the declaration (NOTE: need csstree.js)
      let selector = csstree.generate(rule.ruleNode.prelude);
      // Push selector in correct set 
      if (declaration.value.value.includes("page")) {
        this.selectorFullPage.add(selector);
      }else if(declaration.value.value.includes("spread")) {
        this.selectorFullSpread.add(selector);
      }else if(declaration.value.value.includes("right")) {
        this.selectorFullRight.add(selector);
      }else if(declaration.value.value.includes("left")) {
        this.selectorFullLeft.add(selector);
      }
    }
  }


  afterParsed(parsed){
    // ADD global css
    addcss(cssFullSpread);
    addcss(cssFullPage);
    // ADD pagedjs classes to elements
    for (let item of this.selectorFullPage) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-page-elem");
      }
    }
    for (let item of this.selectorFullSpread) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-spread-elem");
      }
    }
    for (let item of this.selectorFullLeft) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-page-left-elem");
      }
    }
    for (let item of this.selectorFullRight) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-page-right-elem");
      }
    }
  }


  renderNode(clone, node) {
    // FULL SPREAD
    // if you find a full page element, move it in the array
    if (node.nodeType == 1 && node.classList.contains("pagedjs_full-spread-elem")) {
      this.fullSpreadEls.add(node);
      this.usedPagedEls.add(node);

      // remove the element from the flow by hiding it.
      clone.style.display = "none";
    }

    // FULL PAGE
    if (node.nodeType == 1 && node.classList.contains("pagedjs_full-page-left-elem")) {
      this.fullLeftEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    }else if (node.nodeType == 1 && node.classList.contains("pagedjs_full-page-right-elem")) {
      this.fullRightEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    }else if (node.nodeType == 1 && node.classList.contains("pagedjs_full-page-elem")) {
      this.fullPageEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    }

  }

  afterPageLayout(pageElement, page, breakToken, chunker) {

    // ADD --pagedjs-fold on body if doesn't exist
    if(pageElement.classList.contains("pagedjs_first_page")){
      let body = document.getElementsByTagName("body")[0];
      let style = window.getComputedStyle(body);
      let fold = style.getPropertyValue('--pagedjs-fold');
      if(!fold){
        body.style.setProperty('--pagedjs-fold', '0mm')
      }
    }

    // FULL SPREAD
    // if there is an element in the fullSpreadEls Set, (goodbye arrays!)

    for (let img of this.fullSpreadEls) {

      if (page.element.classList.contains("pagedjs_right_page")) {

        let imgLeft;
        let imgRight;
        
        if (img.nodeName == "IMG") {
          /* Add outside + inside container if the element is an img */
          let containerLeft = document.createElement("div");
          containerLeft.classList.add("pagedjs_full-spread_container");
          let containerLeftInside = document.createElement("div");
          containerLeftInside.classList.add("pagedjs_full-spread_content");
          containerLeft.appendChild(containerLeftInside).appendChild(img);
          imgLeft = containerLeft;

          let containerRight = document.createElement("div");
          containerRight.classList.add("pagedjs_full-spread_container");
          let containerRightInside = document.createElement("div");
          containerRightInside.classList.add("pagedjs_full-spread_content");
          containerRight.appendChild(containerRightInside).appendChild(img.cloneNode(true));
          imgRight = containerRight;

        } else {
          /* Add outside container if the element is an img */
          let containerLeft = document.createElement("div");
          containerLeft.classList.add("pagedjs_full-spread_container");
          img.classList.add("pagedjs_full-spread_content");
          containerLeft.appendChild(img);
          imgLeft = containerLeft;
          let containerRight = document.createElement("div");
          containerRight.classList.add("pagedjs_full-spread_container");
          img.classList.add("pagedjs_full-spread_content");
          containerRight.appendChild(img.cloneNode(true));
          imgRight = containerRight;
          
        }

        // put the first element on the page
        let fullPage = chunker.addPage();
        fullPage.element
          .querySelector(".pagedjs_page_content")
          .insertAdjacentElement("afterbegin", imgLeft);
        fullPage.element.classList.add("pagedjs_page_fullLeft");

        // page right
        let fullPageRight = chunker.addPage();
        fullPageRight.element
          .querySelector(".pagedjs_page_content")
          .insertAdjacentElement("afterbegin", imgRight);
        fullPageRight.element.classList.add("pagedjs_page_fullRight");
        img.style.removeProperty("display");

        this.fullSpreadEls.delete(img);
        
      }
    }


    // FULL PAGE
    // if there is an element in the fullPageEls Set
    for (let img of this.fullPageEls) {
      let container = document.createElement("div");
        container.classList.add("pagedjs_full-page_content");
        container.appendChild(img);
      let fullPage = chunker.addPage();

      fullPage.element
        .querySelector(".pagedjs_page_content")
        .insertAdjacentElement("afterbegin", container);
      fullPage.element.classList.add("pagedjs_page_fullPage");
      img.style.removeProperty("display");

      this.fullPageEls.delete(img);
    }

    // FULL Left PAGE
    // if there is an element in the fullLeftEls Set
    for (let img of this.fullLeftEls) {

      if (page.element.classList.contains("pagedjs_right_page")) {
        let container = document.createElement("div");
          container.classList.add("pagedjs_full-page_content");
          container.appendChild(img);
        let fullPage = chunker.addPage();

        fullPage.element
          .querySelector(".pagedjs_page_content")
          .insertAdjacentElement("afterbegin", container);
        fullPage.element.classList.add("pagedjs_page_fullPage");
        img.style.removeProperty("display");

        this.fullLeftEls.delete(img);
      }
    }

    // FULL RIGHT PAGE
    // if there is an element in the fullRightEls Set
    for (let img of this.fullRightEls) {

      if (page.element.classList.contains("pagedjs_left_page")) {
        let container = document.createElement("div");
          container.classList.add("pagedjs_full-page_content");
          container.appendChild(img);
        let fullPage = chunker.addPage();

        fullPage.element
          .querySelector(".pagedjs_page_content")
          .insertAdjacentElement("afterbegin", container);
        fullPage.element.classList.add("pagedjs_page_fullPage");
        img.style.removeProperty("display");

        this.fullRightEls.delete(img);
      }
    }

  }
}
Paged.registerHandlers(fullPageStuff);


function addcss(css){
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  if (s.styleSheet) {   // IE
      s.styleSheet.cssText = css;
  } else {// the world
      s.appendChild(document.createTextNode(css));
  }
  head.appendChild(s);
}