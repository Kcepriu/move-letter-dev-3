export class Canvas {
  constructor(classNameCanvas = 'canvas-field') {
    this.canvasRef = document.querySelector(`.${classNameCanvas}`);
    this.#addListeners();
    this.isAllowDrawing = false;
  }

  #addListeners() {
    window.addEventListener('resize', this.resizeCanvas);
    document.addEventListener('DOMContentLoaded', this.listenerCanvas);
  }

  resizeCanvas = () => {
    this.canvasRef.width = window.innerWidth;
    this.canvasRef.height = window.innerHeight;
  };

  listenerCanvas = () => {
    let isDrawing = false;
    let startX, startY;

    const canvas = this.canvasRef;
    const ctx = canvas.getContext('2d');

    const stopDrawing = () => {
      isDrawing = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('mousemove', event => {
      if (!isDrawing || !this.isAllowDrawing) return;

      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;

      const width = x - startX;
      const height = y - startY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.rect(startX, startY, width, height);
      ctx.stroke();
    });

    canvas.addEventListener('mousedown', event => {
      isDrawing = true;
      startX = event.clientX - canvas.getBoundingClientRect().left;
      startY = event.clientY - canvas.getBoundingClientRect().top;
    });

    canvas.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('mouseleave', stopDrawing);
  };
}
