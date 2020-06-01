import { CSG } from '../CSG.js';
import { Plane } from './CuttingPlane.js';

// # class Polygon

// Represents a convex polygon. The vertices used to initialize a polygon must
// be coplanar and form a convex loop. They do not have to be `Vertex`
// instances but they must behave similarly (duck typing can be used for
// customization).
//
// Each convex polygon has a `shared` property, which is shared between all
// polygons that are clones of each other or were split from the same polygon.
// This can be used to define per-polygon properties (such as surface color).

class Polygon {
  constructor(vertices, shared) {
    this.vertices = vertices;
    this.shared = shared;
    this.plane = Plane.fromPoints(
      vertices[0].pos,
      vertices[1].pos,
      vertices[2].pos,
    );
  }

  clone() {
    const vertices = this.vertices.map(function (v) {
      return v.clone();
    });
    return new Polygon(vertices, this.shared);
  }

  flip() {
    this.vertices.reverse().map(function (v) {
      v.flip();
    });
    this.plane.flip();
  }
}

export { Polygon };
