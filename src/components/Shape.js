import { BufferGeometry } from 'three';

class Shape {
  constructor() {}

  fromGeometry(geometry) {
    if (!geometry instanceof BufferGeometry) {
      console.error(
        'This library only works with three.js BufferGeometry',
      );
      return;
    }

    // TODO
  }
}

export { Shape };
