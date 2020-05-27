import { Vector3 } from 'three';

import { CSG } from '../CSG.js';
import { Polygon } from '../components/Polygon.js';
import { Vertex } from '../components/Vertex.js';

class Cylinder {
  constructor(options = {}) {
    var s = new Vector3(options.start || [0, -1, 0]);
    var e = new Vector3(options.end || [0, 1, 0]);
    var ray = e.minus(s);
    var r = options.radius || 1;
    var slices = options.slices || 16;
    var axisZ = ray.unit(),
      isY = Math.abs(axisZ.y) > 0.5;
    var axisX = new Vector3(isY, !isY, 0).cross(axisZ).unit();
    var axisY = axisX.cross(axisZ).unit();
    var start = new Vertex(s, axisZ.negated());
    var end = new Vertex(e, axisZ.unit());
    var polygons = [];
    function point(stack, slice, normalBlend) {
      var angle = slice * Math.PI * 2;
      var out = axisX
        .times(Math.cos(angle))
        .plus(axisY.times(Math.sin(angle)));
      var pos = s.plus(ray.times(stack)).plus(out.times(r));
      var normal = out
        .times(1 - Math.abs(normalBlend))
        .plus(axisZ.times(normalBlend));
      return new Vertex(pos, normal);
    }
    for (var i = 0; i < slices; i++) {
      var t0 = i / slices,
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
