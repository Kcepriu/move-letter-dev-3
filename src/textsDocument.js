import { NodeFunction } from './nodeFunctions';
import { MovingStructure } from './movingStructure';

export class TextsDocument {
  #isControlDown = false;
  #isMouseDown = false;
  #isMovingLetter = false;
  #isAllowMovingLetter = false;

  constructor(
    classNameTextsDocument = 'texts-document',
    classNameTextLine = 'text-line',
    classNameMovingText = 'moving-test'
  ) {
    this.classNameTextsDocument = classNameTextsDocument;
    this.classNameTextLine = classNameTextLine;

    this.textsDocumentRef = document.querySelector(
      `.${classNameTextsDocument}`
    );

    this.movingTextsDocumentRef = document.querySelector(
      `.${classNameMovingText}`
    );

    this.nodeFunction = new NodeFunction(classNameTextLine);
    this.movingStructure = new MovingStructure();

    this.#addListeners();
  }

  addText = text => {
    const htmlText = `<p class="${this.classNameTextLine}" >${text}</p>`;
    this.textsDocumentRef.insertAdjacentHTML('beforeend', htmlText);
  };

  #addListeners() {
    document.addEventListener('mousedown', this.#handleMouseDown);
    document.addEventListener('mouseup', this.#handleMouseUp);
    // document.addEventListener('mouseleave', this.#handleMouseLeave);

    document.addEventListener('keydown', this.#handleKeyDown);
    document.addEventListener('keyup', this.#handleKeyUp);
  }

  #restoreOriginalElement() {
    if (!this.movingStructure.isOriginalDocument()) return;

    this.nodeFunction.replaceChild(
      this.movingStructure.originalElementFrom,
      this.movingStructure.elementFrom
    );
  }

  #clearToMovingStructure() {
    this.#restoreOriginalElement();

    this.movingStructure.clearStructure();
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
        !this.movingStructure.isSavedElementEqual(foundElementFrom))
    )
      return false;

    if (
      !this.movingStructure.isSavedElement() ||
      !this.movingStructure.isSavedElementEqual(foundElementFrom)
    ) {
      this.movingStructure.addElementFrom(foundElementFrom);

      if (!this.nodeFunction.replaceSplitsCopyTextElement(foundElementFrom)) {
        this.#clearToMovingStructure();
        return false;
      }
    }

    const foundElementWithLetter =
      this.nodeFunction.findElementWithLetter(point);

    if (!foundElementWithLetter || !foundElementWithLetter.textContent)
      return false;

    if (this.movingStructure.isElementInStructure(foundElementWithLetter)) {
      this.movingStructure.deleteElementFromStructure(foundElementWithLetter);
      foundElementWithLetter.dataset.selection = false;
    } else {
      this.movingStructure.addElementToStructure(foundElementWithLetter);
      foundElementWithLetter.dataset.selection = true;
    }

    return true;
  }

  // * Moving text
  #showMovingText = () => {
    this.movingTextsDocumentRef.style.display = 'block';
    this.movingTextsDocumentRef.textContent =
      this.movingStructure.getTextMovingLetters();
  };

  #hideMovingText = () => {
    this.movingTextsDocumentRef.style.display = 'none';
  };

  #moveMovingText = point => {
    this.movingTextsDocumentRef.style.left = point.x + 'px';
    this.movingTextsDocumentRef.style.top = point.y + 5 + 'px';
  };

  // * Handles
  #handleMouseDown = e => {
    this.#isMouseDown = true;
    this.#isAllowMovingLetter = true;
    if (!this.#isControlDown && e.ctrlKey) this.#isControlDown = true;

    if (
      !this.#addLetterToMovingStructure({
        x: e.clientX,
        y: e.clientY,
      })
    )
      return;

    this.isMovingLetter = true;

    document.addEventListener('mousemove', this.#handleMouseMove);
  };

  #handleMouseUp = e => {
    this.#isMouseDown = false;
    this.#isAllowMovingLetter = false;
    this.#isMovingLetter = false;
    this.#hideMovingText();

    document.removeEventListener('mousemove', this.#handleMouseMove);

    if (!this.#isControlDown) {
      // отут треба знайти де ми знаходимось (над яким елементом і над чкою буквою)
      //Якщо над "Чужим елементом, то із старого видаляємл в новий додаємо
      //Якщо над тим самим звідки забираємо то тут треба продумати як видаляти і вставляти
      //ми можемо вставляти лівіше вибраних, правіше і помі ж вибрних

      this.#clearToMovingStructure({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // #handleMouseMove = _.debounce(e => {
  //   if (!this.#isAllowMovingLetter) return;

  //   this.#isMovingLetter = true;

  //   console.log('handleMouseMove', e.clientX, e.clientY);
  // }, 300);

  #handleMouseMove = e => {
    if (!this.#isAllowMovingLetter) return;

    if (!this.#isMovingLetter) {
      this.#isMovingLetter = true;
      this.#showMovingText();
    }
    this.#moveMovingText({ x: e.clientX, y: e.clientY });
  };

  #handleKeyDown = e => {
    e.key === 'Control' && (this.#isControlDown = true);
  };

  #handleKeyUp = e => {
    if (e.key !== 'Control') return;

    this.#isControlDown = false;

    if (!this.#isMouseDown) this.#clearToMovingStructure();
  };
}
