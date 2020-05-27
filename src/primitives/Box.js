import { Vector3 } from 'three';

import { CSG } from '../CSG.js';
import { Polygon } from '../components/Polygon.js';
import { Vertex } from '../components/Vertex.js';

class Box {
  constructor(options = {}) {
    const center = new Vector3().fromArray(
      options.center || [0, 0, 0],
    );

    const r = !options.radius
      ? [1, 1, 1]
      : options.radius.length
      ? options.radius
      : [options.radius, options.radius, options.radius];

    return new CSG().fromPolygons(
      [
        [
          [0, 4, 6, 2],
          [-1, 0, 0],
        ],
        [
          [1, 3, 7, 5],
          [1, 0, 0],
        ],
        [
          [0, 1, 5, 4],
          [0, -1, 0],
        ],
        [
          [2, 6, 7, 3],
          [0, 1, 0],
        ],
        [
          [0, 2, 3, 1],
          [0, 0, -1],
        ],
        [
          [4, 5, 7, 6],
          [0, 0, 1],
        ],
      ].map((info) => {
        return new Polygon(
          info[0].map((i) => {
            const position = new Vector3(
              center.x + radius[0] * (2 * !!(i & 1) - 1),
              center.y + radius[1] * (2 * !!(i & 2) - 1),
              center.z + radius[2] * (2 * !!(i & 4) - 1),
            );
            return new Vertex(position, new Vector3(info[1]));
          }),
        );
      }),
    );
  }
}

export { Box };
