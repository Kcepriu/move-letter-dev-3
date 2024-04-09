export class Canvas {
  constructor(classNameCanvas = 'canvas-field') {
    this.canvasRef = document.querySelector(`.${classNameCanvas}`);
    // this.#addListeners();
  }

  #addListeners() {
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    document.addEventListener(
      'DOMContentLoaded',
      this.#listenerCanvas.bind(this)
    );
  }

  resizeCanvas() {
    this.canvasRef.width = window.innerWidth;
    this.canvasRef.height = window.innerHeight;
  }

  #listenerCanvas() {
    let isDrawing = false;
    let startX, startY;

    const canvas = this.canvasRef;
    const ctx = canvas.getContext('2d');

    const stopDrawing = () => {
      isDrawing = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('mousemove', event => {
      if (!isDrawing) return;

      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top + 25;

      const width = x - startX;
      const height = y - startY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.rect(startX, startY, width, height);
      ctx.stroke();
    });

    canvas.addEventListener('mousedown', event => {
      isDrawing = true;
      startX = event.clientX - canvas.getBoundingClientRect().left;
      startY = event.clientY - canvas.getBoundingClientRect().top + 25;
    });

    canvas.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('mouseleave', stopDrawing);
  }
}
