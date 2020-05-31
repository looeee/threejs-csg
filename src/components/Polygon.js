import { CuttingPlane } from './CuttingPlane.js';

class Polygon {
  constructor(vertices, shared) {
    this.vertices = vertices;
    this.shared = shared;
    // this.plane = new CuttingPlane().setFromCoplanarPoints(
    this.plane = new CuttingPlane().fromPoints(
      vertices[0].position,
      vertices[1].position,
      vertices[2].position,
    );
  }

  clone() {
    const vertices = this.vertices.map((v) => v.clone());
    return new Polygon(vertices, this.shared);
  }

  // flip -> negate
  negate() {
    this.vertices.reverse().map((v) => v.negate());
    this.plane.negate();
  }
}

export { Polygon };
