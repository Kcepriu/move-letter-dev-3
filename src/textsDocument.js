import { NodeFunction } from './nodeFunctions';
import { MovingStructure } from './movingStructure';
import { Canvas } from './canvas';
import { RecSelection } from './recSelection';

export class TextsDocument {
  #statuses = {
    ready: 'READY',
    selected_rec: 'SELECTED_REC',
    moving_letter: 'MOVING_LETTER',
    selected_letter: 'SELECTED_LETTED',
    wait_moving_rec: 'WAIT_MOVING_REC',
  };

  #currentStatusOperation = this.#statuses.ready;

  #isControlDown = false;
  #isMouseDown = false;
  #isShowMovingText = false;

  constructor(
    classNameTextsDocument = 'texts-document',
    classNameTextLine = 'text-line',
    classNameMovingText = 'moving-test'
  ) {
    // this.classNameTextsDocument = classNameTextsDocument;
    this.classNameTextLine = classNameTextLine;

    this.textsDocumentRef = document.querySelector(
      `.${classNameTextsDocument}`
    );

    this.movingTextsDocumentRef = document.querySelector(
      `.${classNameMovingText}`
    );

    this.nodeFunction = new NodeFunction(classNameTextLine);
    this.movingStructure = new MovingStructure();

    this.recSelection = new RecSelection();

    this.canvas = new Canvas();
    this.canvas.resizeCanvas();

    this.#addListeners();
  }

  addText = text => {
    const htmlText = `<p class="${this.classNameTextLine}" >${text}</p>`;
    this.textsDocumentRef.insertAdjacentHTML('beforeend', htmlText);
  };

  #addListeners() {
    document.addEventListener('mousedown', this.#handleMouseDown);
    document.addEventListener('mouseup', this.#handleMouseUp);
    document.addEventListener('keyup', this.#handleKeyUp);
  }

  #restoreOriginalElement() {
    if (this.movingStructure.isExistOriginalFromDocument()) {
      this.nodeFunction.replaceChild(
        this.movingStructure.originalElementFrom,
        this.movingStructure.elementFrom
      );
    }

    if (this.movingStructure.isExistOriginalToDocument()) {
      this.nodeFunction.replaceChild(
        this.movingStructure.originalElementTo,
        this.movingStructure.elementTo
      );
    }
  }

  #clearToMovingStructure() {
    this.#restoreOriginalElement();

    this.movingStructure.clearStructure();
  }

  #addMovingLetterToMovingStructure(point) {
    const foundElementTo = this.nodeFunction.findLineElementUnderCoordinates(
      this.classNameTextLine,
      point
    );

    if (!foundElementTo) return;

    if (!this.movingStructure.isElementToEqualElementFrom(foundElementTo)) {
      this.movingStructure.addElementTo(foundElementTo);

      if (!this.nodeFunction.replaceSplitsCopyTextElement(foundElementTo)) {
        this.#clearToMovingStructure();
        return false;
      }
    }

    const foundElementToMove = this.nodeFunction.findElementWithLetter(point);

    if (!foundElementToMove || !foundElementToMove.textContent) return false;

    this.movingStructure.elementToMove = foundElementToMove;
  }

  #addLetterToMovingStructure(point) {
    const foundElementFrom = this.nodeFunction.findLineElementUnderCoordinates(
      this.classNameTextLine,
      point
    );

    // We don't found element or we have already added a letter from another block
    if (
      !foundElementFrom ||
      (this.movingStructure.isMovingLettersNotEmpty() &&
        !this.movingStructure.isSavedElementFromEqualElementFrom(
          foundElementFrom
        ))
    )
      return false;

    if (
      !this.movingStructure.isSavedElement() ||
      !this.movingStructure.isSavedElementFromEqualElementFrom(foundElementFrom)
    ) {
      this.movingStructure.addElementFrom(foundElementFrom);

      if (!this.nodeFunction.replaceSplitsCopyTextElement(foundElementFrom)) {
        this.#clearToMovingStructure();
        return false;
      }
    }

    const foundElementWithLetter =
      this.nodeFunction.findElementWithLetter(point);

    if (!foundElementWithLetter || !foundElementWithLetter.textContent) {
      this.#clearToMovingStructure();
      return false;
    }

    if (this.movingStructure.isElementInStructure(foundElementWithLetter)) {
      this.movingStructure.deleteElementFromStructure(foundElementWithLetter);
      foundElementWithLetter.dataset.selection = false;
    } else {
      this.movingStructure.addElementToStructure(foundElementWithLetter);
      foundElementWithLetter.dataset.selection = true;
    }

    return this.movingStructure.isMovingLettersNotEmpty();
  }

  #movingChosenLetter(point) {
    this.#addMovingLetterToMovingStructure(point);

    if (!this.movingStructure.elementToMove) return;
    this.movingStructure.toMoveLetters();
  }

  // * Selected area
  #mouseMoveSelection = e => {
    // * 0. Set current position
    this.recSelection.setCurrentPoint({
      x: e.clientX,
      y: e.clientY,
    });

    // * 1. lost a previously found string
    if (
      this.movingStructure.isExistOriginalFromDocument() &&
      !this.recSelection.isAxisInRec()
    ) {
      this.recSelection.axisY = 0;
      this.#clearToMovingStructure();
    }

    // * 2. Search for a element with string
    if (!this.movingStructure.isExistOriginalFromDocument())
      this.#foundWorkElement();

    // * 4. Haven't found yet
    if (!this.movingStructure.isExistOriginalFromDocument()) return;

    // * 5. Look for letters
    this.#foundLetterInRec();
  };

  #foundWorkElement() {
    const textElements = this.textsDocumentRef.querySelectorAll(
      `.${this.classNameTextLine}`
    );

    if (textElements.length === 0) return;

    let foundElementFrom = null;

    for (const element of textElements) {
      const recElement = element.getBoundingClientRect();

      if (
        !this.recSelection.isCoordinateYInRec(recElement.top) &&
        !this.recSelection.isCoordinateYInRec(recElement.bottom) &&
        !this.recSelection.isStartSelectInElementOnAxiosY(
          recElement.top,
          recElement.bottom
        )
      )
        continue;

      if (
        recElement.top > this.recSelection.currentPoint.y &&
        recElement.bottom > this.recSelection.currentPoint.y
      )
        break;
      console.log('add element', element);

      foundElementFrom = element;
      break;
    }

    if (!foundElementFrom) return;

    this.movingStructure.addElementFrom(foundElementFrom);
    if (!this.nodeFunction.replaceSplitsCopyTextElement(foundElementFrom)) {
      this.#clearToMovingStructure();
      return;
    }

    this.recSelection.axisY = this.recSelection.currentPoint.y;
  }

  #foundLetterInRec() {
    const children = this.movingStructure.elementFrom.children;

    const leftCoordinate = this.recSelection.leftCoordinate();
    const rightCoordinate = this.recSelection.rightCoordinate();

    const newMovingLetters = [];

    for (const elementWithLetter of children) {
      const rectElementWithLetter = elementWithLetter.getBoundingClientRect();

      if (elementWithLetter.offsetLeft < leftCoordinate) continue;
      if (elementWithLetter.offsetLeft > rightCoordinate) break;

      if (this.recSelection.isElementInSelected(rectElementWithLetter))
        newMovingLetters.push(elementWithLetter);
    }

    if (newMovingLetters.length === 0) {
      this.movingStructure.clearMovingLetters();
      return;
    }

    this.#combineWithMovingLetters(newMovingLetters);
  }

  #combineWithMovingLetters(newMovingLetters) {
    const movingLetters = this.movingStructure.movingLetters;

    for (let i = movingLetters.length - 1; i > 0; i--) {
      const indexElement = newMovingLetters.findIndex(
        element => element === movingLetters[i]
      );

      if (indexElement === -1) {
        // delete from movingLetters
        movingLetters[i].dataset.selection = false;
        movingLetters.splice(i, 1);
      } else {
        //delete from newMovingLetters
        newMovingLetters.splice(indexElement, 1);
      }
    }

    for (const elementWithLetter of newMovingLetters) {
      this.movingStructure.addElementToStructure(elementWithLetter);
      elementWithLetter.dataset.selection = true;
    }
  }

  // * Moving text
  #showMovingText = () => {
    console.log('🚀 ~ showMovingText:');

    this.movingTextsDocumentRef.style.display = 'block';
    this.movingTextsDocumentRef.textContent =
      this.movingStructure.getTextMovingLetters();

    this.#isShowMovingText = true;
  };

  #hideMovingText = () => {
    this.movingTextsDocumentRef.style.display = 'none';
    this.#isShowMovingText = false;
  };

  #moveMovingText = point => {
    this.movingTextsDocumentRef.style.left = point.x + 'px';
    this.movingTextsDocumentRef.style.top = point.y + 5 + 'px';
  };

  // * Status operation
  #isStatusOperation(status) {
    return this.#currentStatusOperation === status;
  }

  #toStatusSelectedRec(point) {
    this.#currentStatusOperation = this.#statuses.selected_rec;
    this.canvas.isAllowDrawing = true;
    this.recSelection.setStartPoint(point);

    document.addEventListener('mousemove', this.#handleMouseMoveSelection);
    document.removeEventListener('mousemove', this.#handleMouseMoveLetter);
  }

  #toStatusSelectedLetter() {
    this.#currentStatusOperation = this.#statuses.selected_letter;
    document.addEventListener('mousemove', this.#handleMouseMoveLetter);
  }

  #toStatusMovingLetter() {
    this.#currentStatusOperation = this.#statuses.moving_letter;
  }

  #toStatusReady() {
    this.#currentStatusOperation = this.#statuses.ready;
  }

  #toStatusWaitMovingRec() {
    this.#currentStatusOperation = this.#statuses.wait_moving_rec;
  }

  #hideMovingElements() {
    this.#hideMovingText();
    this.recSelection.clearRec();
    this.canvas.isAllowDrawing = false;
  }

  // * Handles
  #handleMouseDown = e => {
    this.#isMouseDown = true;
    this.#isControlDown = e.ctrlKey;

    const currentPoint = {
      x: e.clientX,
      y: e.clientY,
    };

    if (this.#isStatusOperation(this.#statuses.wait_moving_rec)) {
      //Треба подивитись чи тикнули по вибраній області.
      //Якщо так, то переходимо на статус перетягування, якщо ні, то ичищаємо все
      this.#toStatusMovingLetter();
      document.addEventListener('mousemove', this.#handleMouseMoveLetter);
      return;
    }

    if (this.#addLetterToMovingStructure(currentPoint)) {
      this.#toStatusSelectedLetter();
    } else {
      this.#toStatusSelectedRec(currentPoint);
    }
  };

  #handleMouseUp = e => {
    this.#isMouseDown = false;
    this.#hideMovingElements();

    const currentPoint = {
      x: e.clientX,
      y: e.clientY,
    };

    document.removeEventListener('mousemove', this.#handleMouseMoveLetter);
    document.removeEventListener('mousemove', this.#handleMouseMoveSelection);

    if (this.#isControlDown) return;

    if (this.#isStatusOperation(this.#statuses.moving_letter)) {
      this.#movingChosenLetter(currentPoint);
    }

    if (this.#isStatusOperation(this.#statuses.selected_rec)) {
      this.#toStatusWaitMovingRec();
    } else {
      this.#clearToMovingStructure();
      this.#toStatusReady();
    }
  };

  #handleMouseMoveLetter = e => {
    if (
      !this.#isStatusOperation(this.#statuses.selected_letter) &&
      !this.#isStatusOperation(this.#statuses.moving_letter)
    )
      return;

    this.#toStatusMovingLetter();

    if (!this.#isShowMovingText) this.#showMovingText();

    this.#moveMovingText({ x: e.clientX, y: e.clientY });
  };

  #handleMouseMoveSelection = _.throttle(this.#mouseMoveSelection, 100);

  #handleKeyUp = e => {
    if (e.key !== 'Control') return;

    this.#isControlDown = false;

    if (!this.#isMouseDown) this.#clearToMovingStructure();
  };
}
