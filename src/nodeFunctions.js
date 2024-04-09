export class NodeFunction {
  constructor(classNameTextLine = 'text-line') {
    this.classNameTextLine = classNameTextLine;
  }

  findLineElementUnderCoordinates(className, { x, y }) {
    // const elementMouseIsOver = document.elementFromPoint(x, y);
    const elements = document.elementsFromPoint(x, y);
    const foundElement = elements.find(node => node.className === className);

    return foundElement;
  }

  findElementWithLetter(point) {
    const foundTextLineElement = this.findLineElementUnderCoordinates(
      this.classNameTextLine,
      point
    );

    return foundTextLineElement.nodeName === 'WORD'
      ? foundTextLineElement
      : null;
  }

  replaceSplitsCopyTextElement(textElement) {
    if (!textElement) return false;

    const text_nodes = Array.from(textElement.childNodes).filter(node => {
      return (
        node.nodeType == Node.TEXT_NODE && node.nodeValue.match(/[a-zA-Z]{2,}/)
      );
    });

    if (text_nodes.length === 0) return false;

    text_nodes.forEach(node => {
      // const words = node.nodeValue.split(/(\s+)/);
      const letters = node.nodeValue.split('');

      const fragment = document.createDocumentFragment();

      letters.forEach((letter, index) => {
        const letterElem = document.createElement('word');
        letterElem.className = this.classNameTextLine;
        letterElem.dataset.number = index;
        letterElem.textContent = letter;
        fragment.appendChild(letterElem);
      });
      this.replaceChild(fragment, node);
    });

    return true;
  }

  replaceChild(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

  getHitLetter(hit_elem, x, y) {
    let hit_letter = '';

    if (!hit_elem) return hit_letter;

    //text contents of hit element
    const text_nodes = Array.from(hit_elem.childNodes).filter(node => {
      return (
        node.nodeType == Node.TEXT_NODE && node.nodeValue.match(/[a-zA-Z]{2,}/)
      );
    });

    //bunch of text under cursor? break it into words
    if (text_nodes.length === 0) return hit_letter;

    const original_content = hit_elem.cloneNode(true);

    text_nodes.forEach(node => {
      // const words = node.nodeValue.split(/(\s+)/);
      const letters = node.nodeValue.split('');

      const fragment = document.createDocumentFragment();

      letters.forEach((letter, index) => {
        const letterElem = document.createElement('word');
        letterElem.className = this.classNameTextLine;
        letterElem.dataset.number = index;
        letterElem.textContent = letter;
        fragment.appendChild(letterElem);
      });
      // node.parentNode.replaceChild(fragment, node);
      this.replaceChild(fragment, node);
    });

    //get the exact word under cursor
    const foundTextLineElement = this.findLineElementUnderCoordinates(
      this.classNameTextLine,
      { x, y }
    );

    if (foundTextLineElement.nodeName === 'WORD') {
      hit_letter = foundTextLineElement.textContent;
    }

    // hit_elem.parentNode.replaceChild(original_content, hit_elem);
    this.replaceChild(original_content, hit_elem);

    return hit_letter;
  }
}
