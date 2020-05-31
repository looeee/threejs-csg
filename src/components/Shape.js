import {
  BufferAttribute,
  BufferGeometry,
  Vector2,
  // Vector,
} from 'three';

import { Vector } from './Vector.js';
import { Vertex } from './Vertex.js';
import { Polygon } from './Polygon.js';

class Shape {
  constructor(polygons) {
    this.polygons = polygons;
  }

  // TODO:  colors, multiple UVs, handle unknown attributes
  fromGeometry(geometry) {
    if (!geometry instanceof BufferGeometry) {
      console.error(
        'This library only works with three.js BufferGeometry',
      );
      return;
    }

    if (geometry.index !== null) {
      geometry = geometry.toNonIndexed();
    }

    const polygons = [];

    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const uvs = geometry.attributes.uv;

    // TODO
    // const colors = geometry.attributes.color;

    function createVertex(index) {
      const position = new Vector(
        positions.getX(index),
        positions.getY(index),
        positions.getZ(index),
      );
      const normal = normals
        ? new Vector(
            normals.getX(index),
            normals.getY(index),
            normals.getZ(index),
          )
        : null;

      const uv = uvs
        ? new Vector2(uvs.getX(index), uvs.getY(index))
        : null;

      return new Vertex(position, normal, uv);
    }

    for (let i = 0; i < positions.count; i += 3) {
      const v1 = createVertex(i);
      const v2 = createVertex(i + 1);
      const v3 = createVertex(i + 2);

      polygons.push(new Polygon([v1, v2, v3]));
    }

    this.polygons = polygons;

    return this;
  }

  toGeometry() {
    const geometry = new BufferGeometry();

    const positions = [];
    const normals = [];
    const uvs = [];

    for (let i = 0; i < this.polygons.length; i++) {
      const polygon = this.polygons[i];
      const v1 = polygon.vertices[0];
      const v2 = polygon.vertices[1];
      const v3 = polygon.vertices[2];

      v1.position.toArray(positions, i * 9);
      v2.position.toArray(positions, i * 9 + 3);
      v3.position.toArray(positions, i * 9 + 6);

      // Note: it's probably OK to assume that if one vertex doesn't
      // have a normal/uv/color then none do
      if (v1.normal) {
        v1.normal.toArray(normals, i * 9);
      }
      if (v2.normal) {
        v2.normal.toArray(normals, i * 9 + 3);
      }
      if (v3.normal) {
        v3.normal.toArray(normals, i * 9 + 6);
      }

      if (v1.uv) {
        v1.uv.toArray(uvs, i * 6);
      }
      if (v2.uv) {
        v2.uv.toArray(uvs, i * 6 + 2);
      }
      if (v3.uv) {
        v3.uv.toArray(uvs, i * 6 + 4);
      }
    }

    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(positions), 3),
    );
    if (normals.length) {
      geometry.setAttribute(
        'normal',
        new BufferAttribute(new Float32Array(normals), 3),
      );
    }
    if (uvs.length) {
      geometry.setAttribute(
        'uv',
        new BufferAttribute(new Float32Array(uvs), 2),
      );
    }

    return geometry;
  }

  clone() {
    return new Shape(this.polygons.map((p) => p.clone()));
  }

  negate() {
    for (const polygon of this.polygons) {
      polygon.negate();
    }
  }
}

export { Shape };
