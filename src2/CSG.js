import { BufferAttribute, BufferGeometry, Vector2 } from 'three';

import { BSPNode } from './components/BSPNode.js';
import { Polygon } from './components/Polygon.js';
import { Vector } from './components/Vector.js';
import { Vertex } from './components/Vertex.js';

// Constructive Solid Geometry (CSG) is a modeling technique that uses Boolean
// operations like union and intersection to combine 3D solids. This library
// implements CSG operations on meshes elegantly and concisely using BSP trees,
// and is meant to serve as an easily understandable implementation of the
// algorithm. All edge cases involving overlapping coplanar polygons in both
// solids are correctly handled.
//
// ## Implementation Details
//
// All CSG operations are implemented in terms of two functions, `clipTo()` and
// `invert()`, which remove parts of a BSP tree inside another BSP tree and swap
// solid and empty space, respectively. To find the union of `a` and `b`, we
// want to remove everything in `a` inside `b` and everything in `b` inside `a`,
// then combine polygons from `a` and `b` into one solid:
//
//     a.clipTo(b);
//     b.clipTo(a);
//     a.build(b.allPolygons());
//
// The only tricky part is handling overlapping coplanar polygons in both trees.
// The code above keeps both copies, but we need to keep them in one tree and
// remove them in the other tree. To remove them from `b` we can clip the
// inverse of `b` against `a`. The code for union now looks like this:
//
//     a.clipTo(b);
//     b.clipTo(a);
//     b.invert();
//     b.clipTo(a);
//     b.invert();
//     a.build(b.allPolygons());
//
// Subtraction and intersection naturally follow from set operations. If
// union is `A | B`, subtraction is `A - B = ~(~A | B)` and intersection is
// `A & B = ~(~A | ~B)` where `~` is the complement operator.
//
// ## License
//
// Copyright (c) 2011 Evan Wallace (http://madebyevan.com/), under the MIT license.

// # class CSG

// Holds a binary space partition tree representing a 3D solid. Two solids can
// be combined using the `union()`, `subtract()`, and `intersect()` methods.

class CSG {
  constructor() {
    this.polygons = [];
  }

  static fromGeometry(geometry) {
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

    const csg = new CSG();
    csg.polygons = polygons;
    return csg;
  }

  static fromPolygons(polygons) {
    const csg = new CSG();
    csg.polygons = polygons;
    return csg;
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

      v1.pos.toArray(positions, i * 9);
      v2.pos.toArray(positions, i * 9 + 3);
      v3.pos.toArray(positions, i * 9 + 6);

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
    const csg = new CSG();
    csg.polygons = this.polygons.map(function (p) {
      return p.clone();
    });
    return csg;
  }

  toPolygons() {
    return this.polygons;
  }

  // Return a new CSG solid representing space in either this solid or in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.union(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |       +----+
  //     +----+--+    |       +----+       |
  //          |   B   |            |       |
  //          |       |            |       |
  //          +-------+            +-------+
  //
  union(csg) {
    const a = new BSPNode(this.clone().polygons);
    const b = new BSPNode(csg.clone().polygons);
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    return CSG.fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space in this solid but not in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.subtract(B)
  //
  //     +-------+            +-------+
  //     |       |            |       |
  //     |   A   |            |       |
  //     |    +--+----+   =   |    +--+
  //     +----+--+    |       +----+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  subtract(csg) {
    const a = new BSPNode(this.clone().polygons);
    const b = new BSPNode(csg.clone().polygons);
    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    a.invert();
    return CSG.fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid representing space both this solid and in the
  // solid `csg`. Neither this solid nor the solid `csg` are modified.
  //
  //     A.intersect(B)
  //
  //     +-------+
  //     |       |
  //     |   A   |
  //     |    +--+----+   =   +--+
  //     +----+--+    |       +--+
  //          |   B   |
  //          |       |
  //          +-------+
  //
  intersect(csg) {
    const a = new BSPNode(this.clone().polygons);
    const b = new BSPNode(csg.clone().polygons);
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allPolygons());
    a.invert();
    return CSG.fromPolygons(a.allPolygons());
  }

  // Return a new CSG solid with solid and empty space switched. This solid is
  // not modified.
  inverse() {
    const csg = this.clone();
    csg.polygons.map(function (p) {
      p.flip();
    });
    return csg;
  }
}

export { CSG };
