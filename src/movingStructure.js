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
    this.elementToMove = null;
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

  clearMovingLetters() {
    this.movingLetters = [];
  }

  addElementFrom(elementFrom) {
    this.elementFrom = elementFrom;
    this.originalElementFrom = elementFrom.cloneNode(true);
  }

  addElementTo(elementFrom) {
    this.elementTo = elementFrom;
    this.originalElementTo = elementFrom.cloneNode(true);
  }

  countInMovingLetters() {
    return this.movingLetters.length;
  }
  isElementInStructure(element) {
    return this.movingLetters.find(letterElement => letterElement === element);
  }

  isExistOriginalFromDocument() {
    return !!this.elementFrom && !!this.originalElementFrom;
  }

  isExistOriginalToDocument() {
    return !!this.elementTo && !!this.originalElementTo;
  }

  isMovingLettersNotEmpty() {
    return !!this.elementFrom && this.movingLetters.length > 0;
  }

  isSavedElementFromEqualElementFrom(element) {
    return (
      this.elementFrom === element || this.elementFrom === element.parentNode
    );
  }

  isElementToEqualElementFrom(elementTo) {
    return (
      this.elementFrom === elementTo ||
      this.elementFrom === elementTo.parentNode
    );
  }

  isSavedElement(element) {
    return !!this.elementFrom;
  }

  isEmptyMovingLetters() {
    return this.movingLetters.length === 0;
  }

  toMoveLetters() {
    if (this.isExistOriginalToDocument()) {
      this.#movingChosenLetterToAnotherElement();
    } else {
      this.#movingChosenLetterToThisElement();
    }
  }

  #movingChosenLetterToAnotherElement() {
    //add
    const originalTextContent = this.originalElementTo.textContent;
    const numberInsertPosition = this.elementToMove.dataset.number;
    const insertText = this.getTextMovingLetters();

    this.originalElementTo.textContent =
      originalTextContent.substring(0, numberInsertPosition) +
      insertText +
      originalTextContent.substring(numberInsertPosition);

    const arrayIndexToDelete = this.#createArrayIndexToDelete();
    // delete
    const originalTextContentFrom = this.originalElementFrom.textContent;
    this.originalElementFrom.textContent = this.#deleteMovingLetters(
      originalTextContentFrom,
      arrayIndexToDelete
    );
  }

  #movingChosenLetterToThisElement() {
    //add
    const originalTextContent = this.originalElementFrom.textContent;
    const numberInsertPosition = this.elementToMove.dataset.number;
    const insertText = this.getTextMovingLetters();

    const newTextContent =
      originalTextContent.substring(0, numberInsertPosition) +
      insertText +
      originalTextContent.substring(numberInsertPosition);

    const arrayIndexToDelete = this.#createArrayIndexToDelete(
      Number(numberInsertPosition),
      Number(insertText.length)
    );

    // delete
    this.originalElementFrom.textContent = this.#deleteMovingLetters(
      newTextContent,
      arrayIndexToDelete
    );
  }

  #createArrayIndexToDelete(numberInsertPosition = 0, countInsertLetter = 0) {
    const isAddOptions = !this.isExistOriginalToDocument();

    const indexesToRemove = this.movingLetters.map(element => {
      let index = Number(element.dataset.number);
      if (isAddOptions && index >= numberInsertPosition) {
        index += countInsertLetter;
      }

      return index;
    });

    indexesToRemove.sort((a, b) => b - a);

    return indexesToRemove;
  }

  #deleteMovingLetters(text, indexesToRemove) {
    let chars = text.split('');
    indexesToRemove.forEach(index => {
      chars.splice(index, 1);
    });

    return chars.join('');
  }
}
