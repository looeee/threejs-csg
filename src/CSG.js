import { BSPNode } from './components/BSPNode.js';
import { Shape } from './components/Shape.js';

// Holds a binary space partition tree representing a 3D solid.
// Two solids can be combined using the union(), subtract(), and intersect() methods.
class CSG {
  constructor() {
    this.polygons = [];
  }

  clone() {
    const csg = new CSG();
    csg.polygons = this.polygons.map((p) => p.clone());
    return csg;
  }

  static createShapeFromGeometry(geometry) {
    return new Shape().fromGeometry(geometry);
  }

  fromGeometry(geometry) {
    this.polygons = new Shape().fromGeometry(geometry).polygons;
    return this;
  }

  // export the result as a three.js buffergeometry
  // options:
  // retesselate: true (TODO) merge coplanar faces
  // canonicalize: true (TODO) merge vertices with eps distance
  toGeometry() {
    return new Shape(this.polygons).toGeometry();
    return this;
  }

  fromShape(shape) {
    this.polygons = shape.polygons;
    return this;
  }

  fromPolygons = function (polygons) {
    this.polygons = polygons;
    return this;
  };

  toPolygons() {
    return this.polygons;
  }

  // Return a new CSG solid representing space in either this solid or in the solid csg.
  // Neither this solid nor the solid csg are modified.
  // Union AKA addition
  // Equivalent to OR (A||B)
  // Can also be expressed as !(!A && !B)
  union(csg) {
    const a = new BSPNode(this.clone().polygons);
    console.log('a: ', a);
    const b = new BSPNode(csg.clone().polygons);
    console.log('b: ', b);

    // remove all polygons from a that are inside b
    a.clipTo(b);

    // // remove all polygons from b that are inside a
    b.clipTo(a);

    // // invert b
    b.negate();

    // // remove all polygons from b that are inside a
    b.clipTo(a);

    // // invert b
    b.negate();

    a.build(b.allPolygons());
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space in this solid but not in the solid csg.
  // Neither this solid nor the solid csg are modified.
  // Equivalent to AND NOT (A && !B)
  subtract(csg) {
    const a = new BSPNode(this.clone().polygons);
    // console.log('a: ', a);
    const b = new BSPNode(csg.clone().polygons);
    // console.log('b: ', b);
    a.negate();
    a.clipTo(b);
    b.clipTo(a);
    b.negate();
    b.clipTo(a);
    b.negate();
    a.build(b.allPolygons());
    a.negate();
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space both this solid and in the solid csg.
  // Neither this solid nor the solid csg are modified.
  // Intersection AKA Common
  // Equivalent to logical AND (A&&B)
  intersect(csg) {
    const a = new BSPNode(this.clone().polygons);
    // console.log('a: ', a);
    const b = new BSPNode(csg.clone().polygons);
    // console.log('b: ', b);
    a.negate();
    b.clipTo(a);
    b.negate();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allPolygons());
    a.negate();
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid with solid and empty space switched.
  // This solid is not modified.
  // inverse AKA invert AKA negate AKA complement
  // Equivalent to logical NOT (!A)
  // This is used as an intermediate step, the actual geometry can't be rendered
  // (how could you render "everything that's outside a cube", for example?)
  inverse() {
    const csg = this.clone();
    csg.polygons.map((p) => p.negate());
    return csg;
  }
}

export { CSG };
