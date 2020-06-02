import { Plane, Vector3 } from 'three';
import { Polygon } from './Polygon.js';

var _vector1 = new Vector3();
var _vector2 = new Vector3();

class CuttingPlane extends Plane {
  constructor(normal, constant) {
    super(normal, constant);
  }

  fromPoints(a, b, c) {
    const normal = b
      .subVectors(b, a)
      .cross(_vector2.subVectors(c, a))
      .normalize();

    this.normal = normal;
    this.constant = normal.dot(a);

    return this;
  }

  setFromCoplanarPoints(a, b, c) {
    var normal = _vector1
      .subVectors(c, b)
      .cross(_vector2.subVectors(a, b))
      .normalize();

    this.setFromNormalAndCoplanarPoint(normal, a);

    return this;
  }

  setFromNormalAndCoplanarPoint(normal, point) {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);

    return this;
  }

  clone() {
    return new CuttingPlane().copy(this);
  }

  copy(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  }

  negate() {
    this.constant *= -1;
    this.normal.negate();

    return this;
  }

  // Split `polygon` by this plane if needed, then put the polygon or polygon
  // fragments in the appropriate lists. Coplanar polygons go into either
  // `coplanarFront` or `coplanarBack` depending on their orientation with
  // respect to this plane. Polygons in front or in back of this plane go into
  // either `front` or `back`.
  splitPolygon(polygon, coplanarFront, coplanarBack, front, back) {
    const COPLANAR = 0;
    const FRONT = 1;
    const BACK = 2;
    const SPANNING = 3;

    // tolerance used to decide if a point is on the plane.
    const EPSILON = 1e-5;

    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let polygonType = 0;
    const types = [];
    for (let i = 0; i < polygon.vertices.length; i++) {
      const t =
        this.normal.dot(polygon.vertices[i].pos) - this.constant;
      const type =
        t < -EPSILON ? BACK : t > EPSILON ? FRONT : COPLANAR;
      polygonType |= type;
      types.push(type);
    }

    // Put the polygon in the correct list, splitting it when necessary.
    switch (polygonType) {
      case COPLANAR:
        (this.normal.dot(polygon.plane.normal) > 0
          ? coplanarFront
          : coplanarBack
        ).push(polygon);
        break;
      case FRONT:
        front.push(polygon);
        break;
      case BACK:
        back.push(polygon);
        break;
      case SPANNING:
        const f = [];
        const b = [];
        for (let i = 0; i < polygon.vertices.length; i++) {
          const j = (i + 1) % polygon.vertices.length;
          const ti = types[i];
          const tj = types[j];
          const vi = polygon.vertices[i];
          const vj = polygon.vertices[j];
          if (ti != BACK) f.push(vi);
          if (ti != FRONT) b.push(ti != BACK ? vi.clone() : vi);
          if ((ti | tj) == SPANNING) {
            const t =
              (this.constant - this.normal.dot(vi.pos)) /
              this.normal.dot(vj.pos.clone().sub(vi.pos));
            const v = vi.interpolate(vj, t);
            f.push(v);
            b.push(v.clone());
          }
        }
        if (f.length >= 3) {
          const p = new Polygon(f);
          front.push(p);
        }

        if (b.length >= 3) {
          const p = new Polygon(b);
          back.push(p);
        }
        break;
    }
  }
}

export { CuttingPlane };
