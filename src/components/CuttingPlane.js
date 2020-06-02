import { CSG } from '../CSG.js';
import { Polygon } from './Polygon.js';

class Plane {
  constructor(normal, w) {
    this.normal = normal;
    this.w = w;
  }

  // `Plane.EPSILON` is the tolerance used by `splitPolygon()` to decide if a
  // point is on the plane.
  static EPSILON = 1e-5;

  static fromPoints(a, b, c) {
    const n = b.minus(a).cross(c.minus(a)).unit();
    return new Plane(n, n.dot(a));
  }

  clone() {
    return new Plane(this.normal.clone(), this.w);
  }

  flip() {
    this.normal = this.normal.negated();
    this.w = -this.w;
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

    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let polygonType = 0;
    const types = [];
    for (let i = 0; i < polygon.vertices.length; i++) {
      const t = this.normal.dot(polygon.vertices[i].pos) - this.w;
      const type =
        t < -Plane.EPSILON
          ? BACK
          : t > Plane.EPSILON
          ? FRONT
          : COPLANAR;
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
              (this.w - this.normal.dot(vi.pos)) /
              this.normal.dot(vj.pos.minus(vi.pos));
            const v = vi.interpolate(vj, t);
            f.push(v);
            b.push(v.clone());
          }
        }
        if (f.length >= 3) {
          const p = new Polygon(f, polygon.shared);
          front.push(p); // correct
        }

        if (b.length >= 3) {
          const p = new Polygon(b, polygon.shared);
          back.push(p);
        }

        // if (f.length === 3) {
        //   const p = new Polygon(f, polygon.shared);
        //   // p.flip();
        //   front.push(p); // correct
        // } else if (f.length === 4) {
        //   // split 4 sided poly
        //   const p1 = new Polygon([f[0], f[1], f[2]], polygon.shared);
        //   const p2 = new Polygon([f[0], f[2], f[3]], polygon.shared);
        //   // p1.flip();
        //   // p2.flip();
        //   // console.log('p2: ', p2);
        //   // p2.plane.flip();
        //   front.push(p1); // correct
        //   front.push(p2);
        // }

        // if (b.length === 3) {
        //   const p = new Polygon(b, polygon.shared);
        //   // p.flip();
        //   back.push(p);
        // } else if (b.length === 4) {
        //   // split 4 sided poly
        //   const p1 = new Polygon([b[0], b[1], b[2]], polygon.shared);
        //   const p2 = new Polygon([b[0], b[2], b[3]], polygon.shared);
        //   // p1.flip();
        //   // p2.flip();
        //   // p2.plane.flip();
        //   back.push(p1);
        //   back.push(p2);
        // }
        break;
    }
  }
}

export { Plane };
