import { Node } from './components/Node.js';

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

  fromPolygons = function (polygons) {
    this.polygons = polygons;
    return csg;
  };

  toPolygons() {
    return this.polygons;
  }

  // export the result as a three.js buffergeometry
  // options:
  // retesselate: true (TODO) merge coplanar faces
  // canonicalize: true (TODO) merge vertices with eps distance
  toGeometry() {
    // TODO
  }

  // Return a new CSG solid representing space in either this solid or in the solid csg.
  // Neither this solid nor the solid csg are modified.
  union(csg) {
    const a = new Node(this.clone().polygons);
    const b = new Node(csg.clone().polygons);
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space in this solid but not in the solid csg.
  // Neither this solid nor the solid csg are modified.
  subtract(csg) {
    var a = new Node(this.clone().polygons);
    var b = new Node(csg.clone().polygons);
    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    a.invert();
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space both this solid and in the solid csg.
  // Neither this solid nor the solid csg are modified.
  intersect(csg) {
    var a = new Node(this.clone().polygons);
    var b = new Node(csg.clone().polygons);
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allPolygons());
    a.invert();
    return new CSG().fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid with solid and empty space switched.
  // This solid is not modified.
  inverse() {
    const csg = this.clone();
    csg.polygons.map((p) => p.negate());
    return csg;
  }
}

export { CSG };
