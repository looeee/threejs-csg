import { Vector3 } from 'three';

import { CSG } from '../CSG.js';
import { Polygon } from '../components/Polygon.js';
import { Vertex } from '../components/Vertex.js';

class Sphere {
  constructor(options = {}) {
    const c = new Vector3(options.center || [0, 0, 0]);
    const r = options.radius || 1;
    const slices = options.slices || 16;
    const stacks = options.stacks || 8;
    const polygons = [];
    let vertices;

    function vertex(theta, phi) {
      theta *= Math.PI * 2;
      phi *= Math.PI;
      const dir = new Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      );
      vertices.push(new Vertex(c.add(dir.multiplyScalar(r)), dir));
    }

    for (let i = 0; i < slices; i++) {
      for (let j = 0; j < stacks; j++) {
        vertices = [];
        vertex(i / slices, j / stacks);
        if (j > 0) vertex((i + 1) / slices, j / stacks);
        if (j < stacks - 1)
          vertex((i + 1) / slices, (j + 1) / stacks);
        vertex(i / slices, (j + 1) / stacks);
        polygons.push(new Polygon(vertices));
      }
    }
    return new CSG().fromPolygons(polygons);
  }
}

export { Sphere };
