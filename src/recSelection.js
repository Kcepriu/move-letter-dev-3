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
    this.axisY = 0;
  }

  isAxisInRec() {
    return (
      this.startPoint.y !== this.currentPoint.y &&
      this.topCoordinate() <= this.axisY &&
      this.axisY <= this.bottomCoordinate
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

  isStartSelectInElementOnAxiosY(top, bottom) {
    console.log(top <= this.startPoint.y && this.startPoint.y <= bottom);
    return top <= this.startPoint.y && this.startPoint.y <= bottom;
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

  isElementInSelected(recElement) {
    // console.log(
    //   this.leftCoordinate(),
    //   recElement.right,
    //   this.rightCoordinate()
    // );

    // console.log(this.topCoordinate(), recElement.top, this.bottomCoordinate());

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
}
