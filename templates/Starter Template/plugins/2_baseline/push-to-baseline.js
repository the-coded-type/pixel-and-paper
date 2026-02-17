// warning, offset top is added/ merged after the element is added, so things will move after the baseline offset is set in case of merged margin
//
//
//  if it find --paged-push-to-baseline in the css, it will use the number (in px) to define the baseline to which push the content


class baseline extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.baselineElements = [];
  }
  

  onDeclaration(declaration, dItem, dList, rule) {
    if (declaration.property == "--paged-push-to-baseline") {
      let sel = csstree.generate(rule.ruleNode.prelude);
      sel = sel.replaceAll('[data-id="', "#");
      sel = sel.replaceAll('"]', "");
      this.baselineElements.push({
        selectors: sel,
        baseline: parseInt(declaration.value.value),
      });
    }
  }

  beforeParsed(content) {
    this.baselineElements.forEach((bs) => {
      content.querySelectorAll(bs.selectors).forEach((el) => {
        el.classList.add("pushToBaseline");
        el.dataset.baseline = bs.baseline;
      });
    });
  }

  renderNode(node, sourceNode) {
    if (node.nodeType == 1 && node.classList.contains("pushToBaseline")) {
      console.log(node, node.dataset.baseline);
      startBaseline(node, node.dataset.baseline);
    }
  }
}

Paged.registerHandlers(baseline);

function startBaseline(element, baseline = 16) {
  // snap element after specific element on the baseline grid.

  if (element) {
    const elementOffset = element.offsetTop;

    const elementline = Math.floor(elementOffset / baseline);

    if (elementline != baseline) {
      const nextPline = (elementline + 1) * baseline;

      if (!(nextPline - elementOffset == baseline)) {
        element.style.paddingTop = `${nextPline - elementOffset}px`;
      }
    }
  }
}
