export class FormAddText {
  constructor(addText, classNameForm = 'text-form') {
    this.textForm = document.querySelector(`.${classNameForm}`);
    this.addText = addText;
    this.#addListener();
  }

  #addListener() {
    this.textForm.addEventListener('submit', this.#handleSubmitForm.bind(this));
  }

  #handleSubmitForm(event) {
    const form = event.target;
    event.preventDefault();

    this.addText(form.elements.text.value.trim());

    form.reset();
  }
}
