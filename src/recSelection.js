export class RecSelection {
  constructor() {
    this.clearRec();
  }

  setStartPoint({ x, y }) {
    this.startPoint = { x, y };
  }

  setCurrentPoint({ x, y }) {
    this.currentPoint = { x, y };
  }

  clearRec() {
    this.startPoint = { x: 0, y: 0 };
    this.currentPoint = { x: 0, y: 0 };
  }

  isElementInRecSelection(recElement) {
    return (
      this.isCoordinateYInRec(recElement.top) ||
      this.isCoordinateYInRec(recElement.bottom) ||
      this.isStartSelectInElementOnAxisY(recElement)
    );
  }

  isElementUnderRecSelection(recElement) {
    return (
      recElement.top > this.currentPoint.y &&
      recElement.bottom > this.currentPoint.y
    );
  }

  isCoordinateYInRec(y) {
    return (
      (this.startPoint.y <= y && y <= this.currentPoint.y) ||
      (this.currentPoint.y <= y && y <= this.startPoint.y)
    );
  }

  isCoordinateXInRec(x) {
    return (
      (this.startPoint.x <= x && x <= this.currentPoint.x) ||
      (this.currentPoint.x <= x && x <= this.startPoint.x)
    );
  }

  isStartSelectInElementOnAxisY(recElement) {
    return (
      recElement.top <= this.startPoint.y &&
      this.startPoint.y <= recElement.bottom
    );
  }

  oppositeVerticalAngle() {
    return {
      x: this.startPoint.x,
      y: this.currentPoint.y,
    };
  }

  rightCoordinate() {
    return Math.max(this.startPoint.x, this.currentPoint.x);
  }

  leftCoordinate() {
    return Math.min(this.startPoint.x, this.currentPoint.x);
  }

  topCoordinate() {
    return Math.min(this.startPoint.y, this.currentPoint.y);
  }

  bottomCoordinate() {
    return Math.max(this.startPoint.y, this.currentPoint.y);
  }

  isElementInSelectedAxisX(recElement) {
    return (
      ((this.leftCoordinate() <= recElement.left &&
        recElement.left <= this.rightCoordinate()) ||
        (this.leftCoordinate() <= recElement.right &&
          recElement.right <= this.rightCoordinate())) &&
      ((this.topCoordinate() <= recElement.top &&
        recElement.top <= this.bottomCoordinate()) ||
        (this.topCoordinate() <= recElement.bottom &&
          recElement.bottom <= this.bottomCoordinate()))
    );
  }

  isElementInSelectedAxisY(recElement) {
    return true;
  }

  isElementInAnotherLine(recElement, recTestElement) {
    return (
      recTestElement.bottom < recElement.top ||
      recTestElement.top > recElement.bottom
    );
  }
}
