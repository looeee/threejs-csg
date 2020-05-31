import { Vector } from './Vector.js';

import { CSG } from '../CSG.js';
import { Polygon } from '../components/Polygon.js';
import { Vertex } from '../components/Vertex.js';

class Cylinder {
  constructor(options = {}) {
    const s = new Vector(options.start || [0, -1, 0]);
    const e = new Vector(options.end || [0, 1, 0]);
    const ray = e.sub(s);
    const r = options.radius || 1;
    const slices = options.slices || 16;
    const axisZ = ray.normalize();
    const isY = Math.abs(axisZ.y) > 0.5;
    const axisX = new Vector(isY, !isY, 0).cross(axisZ).normalize();
    const axisY = axisX.cross(axisZ).normalize();
    const start = new Vertex(s, axisZ.negate());
    const end = new Vertex(e, axisZ.normalize());
    const polygons = [];
    function point(stack, slice, normalBlend) {
      const angle = slice * Math.PI * 2;
      const out = axisX
        .multiplyScalar(Math.cos(angle))
        .add(axisY.multiplyScalar(Math.sin(angle)));
      const pos = s
        .add(ray.multiplyScalar(stack))
        .add(out.multiplyScalar(r));
      const normal = out
        .multiplyScalar(1 - Math.abs(normalBlend))
        .add(axisZ.multiplyScalar(normalBlend));
      return new Vertex(pos, normal);
    }
    for (const i = 0; i < slices; i++) {
      const t0 = i / slices,
        t1 = (i + 1) / slices;
      polygons.push(
        new Polygon([start, point(0, t0, -1), point(0, t1, -1)]),
      );
      polygons.push(
        new Polygon([
          point(0, t1, 0),
          point(0, t0, 0),
          point(1, t0, 0),
          point(1, t1, 0),
        ]),
      );
      polygons.push(
        new Polygon([end, point(1, t1, 1), point(1, t0, 1)]),
      );
    }
    return new CSG().fromPolygons(polygons);
  }
}

export { Cylinder };
