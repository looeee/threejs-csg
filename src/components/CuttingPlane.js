import { Plane } from 'three';
import { Polygon } from './Polygon.js';

class CuttingPlane extends Plane {
  constructor(normal, constant) {
    super(normal, constant);
  }

  // flip -> negate

  // fromPoints -> setFromCoplanarPoints

  // clone -> clone

  // Split polygon by this plane if needed,
  // then put the polygon or polygon fragments in the appropriate lists.
  // Coplanar polygons go into either coplanarFrontPolygons or coplanarBackPolygons
  // depending on their orientation with respect to this plane.
  // Polygons in front or in back of this plane go into either front or back.
  //
  // TODO: can this be simplified knowing that all polygons are triangles?
  splitPolygon(
    polygon,
    coplanarFrontPolygons,
    coplanarBackPolygons,
    frontPolygons,
    backPolygons,
  ) {
    // First, we will classify the polygon in one of these four classes
    // relative to the plane. If the polygon is spanning the plane
    // it must be split
    const coplanar = 0;
    const inFront = 1;
    const behind = 2;
    const spanning = 3;

    // tolerance to decide if a point is on the plane.
    const epsilon = 1e-5;

    let polygonType = 0;
    const types = [];

    for (let i = 0; i < polygon.vertices.length; i++) {
      const t =
        this.normal.dot(polygon.vertices[i].position) - this.constant;

      let type;
      if (t < -epsilon) {
        type = behind;
      } else if (t > epsilon) {
        type = inFront;
      } else {
        type = coplanar;
      }

      // smart (or at least, short) way to get the final polygon
      // type by considering the status of each vertex
      polygonType |= type;

      types.push(type);
    }
    // console.log('polygonType: ', polygonType);
    // console.log('types: ', types);

    // Put the polygon in the correct list, splitting if necessary.
    // debugger;
    switch (polygonType) {
      case coplanar:
        if (this.normal.dot(polygon.plane.normal) > 0) {
          coplanarFrontPolygons.push(polygon);
        } else {
          coplanarBackPolygons.push(polygon);
        }
        break;
      case inFront:
        frontPolygons.push(polygon);
        break;
      case behind:
        backPolygons.push(polygon);
        break;
      case spanning:
        // TODO: move into separate function and give variables better names
        // TODO: this looks like the stanard clipping algorithm as defined here:
        // https://www.geometrictools.com/Documentation/ClipMesh.pdf
        // verify?
        const f = [];
        const b = [];
        for (let i = 0; i < polygon.vertices.length; i++) {
          const j = (i + 1) % polygon.vertices.length;
          const ti = types[i];
          const tj = types[j];
          const vi = polygon.vertices[i];
          const vj = polygon.vertices[j];

          if (ti != behind) f.push(vi);
          if (ti != inFront) {
            b.push(ti != behind ? vi.clone() : vi);
          }

          if ((ti | tj) == spanning) {
            const t =
              (this.constant - this.normal.dot(vi.position)) /
              this.normal.dot(vj.position.sub(vi.position));

            const v = vi.interpolate(vj, t);
            f.push(v);
            b.push(v.clone());
          }
        }
        if (f.length >= 3)
          frontPolygons.push(new Polygon(f, polygon.shared));
        if (b.length >= 3)
          backPolygons.push(new Polygon(b, polygon.shared));
        break;
    }
  }
}

export { CuttingPlane };
