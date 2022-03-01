import { ensureIconBaseClass } from './RBIcon/RBIconUtility';

export default class RBInputSymbol {
  constructor() {
    this.appendElement = undefined;
  }

  link(element, options) {
    if (!options) {
      return;
    }

    // Ensure only one symbol exists
    if (this.appendElement) {
      this.appendElement.remove();
    }

    let template;

    // Check that alignment is set, otherwise default to left
    const align = options.align || 'left';

    if (options.icon) {
      var className = `vd-input--icon-${align}`;
      if (!element.classList.contains(className))
        element.classList.add(className);
      template = document.createElement('i');
      template.className = `${ensureIconBaseClass(
        options.icon
      )} vd-input-icon vd-input-icon--${align}`;
    } else {
      const symbolOffset = 2;
      const symbolPadding =
        options.symbol.replace(' ', '').length + symbolOffset;

      element.setAttribute('style', `padding-${align}: ${symbolPadding}ch`);
      template = document.createElement('div');
      template.className = `vd-input-icon vd-input-icon--${align} vd-input-symbol`;
      template.appendChild(document.createTextNode(options.symbol));
    }

    this.appendElement = template;
    element.insertAdjacentElement('afterend', template);
  }
}
