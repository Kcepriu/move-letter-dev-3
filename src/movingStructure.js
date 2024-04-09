const emptyMovingStructure = {
  elementFrom: null,
  originalElementFrom: null,

  elementTo: null,
  originalElementTo: null,

  movingLetters: [],
  letterWhereToInsert: null,
};

export class MovingStructure {
  constructor() {
    this.clearStructure();
  }

  clearStructure() {
    this.elementFrom = null;
    this.originalElementFrom = null;

    this.elementTo = null;
    this.originalElementTo = null;

    this.movingLetters = [];
    this.letterWhereToInsert = null;
  }

  getTextMovingLetters() {
    return this.movingLetters.reduce(
      (result, element) => result + element.textContent,
      ''
    );
  }

  addElementToStructure(element) {
    this.movingLetters.push(element);
  }

  deleteElementFromStructure(element) {
    this.movingLetters = this.movingLetters.filter(
      letterElement => letterElement !== element
    );
  }

  isElementInStructure(element) {
    return this.movingLetters.find(letterElement => letterElement === element);
  }

  isOriginalDocument() {
    return !!this.elementFrom && !!this.originalElementFrom;
  }

  isMovingLettersNotEmpty() {
    return !!this.elementFrom && this.movingLetters.length > 0;
  }
  addElementFrom(elementFrom) {
    this.elementFrom = elementFrom;
    this.originalElementFrom = elementFrom.cloneNode(true);
  }

  isSavedElementEqual(element) {
    return (
      this.elementFrom === element || this.elementFrom === element.parentNode
    );
  }

  isSavedElement(element) {
    return !!this.elementFrom;
  }
}
