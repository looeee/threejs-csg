import { Shape } from './Shape.js';

// Holds a node in a BSP tree.
// A BSP tree is built from a collection of polygons by picking a polygon to split along.
// That polygon (and all other coplanar polygons) are added directly to that
// node and the other polygons are added to the front and/or back subtrees.
// This is not a leafy BSP tree since there is no distinction between internal and leaf nodes.
class Node {
  constructor(polygons) {
    this.plane = null;
    this.front = null;
    this.back = null;
    this.polygons = polygons;

    if (polygons) this.build(polygons);
  }

  clone() {
    const node = new Node();
    node.plane = this.plane && this.plane.clone();
    node.front = this.front && this.front.clone();
    node.back = this.back && this.back.clone();
    node.polygons = this.polygons.map((p) => p.clone());
    return node;
  }

  // Invert the shape
  negate() {
    for (const polygon of this.polygons) {
      polygon.negate();
    }

    this.plane.negate();
    if (this.front) this.front.negate();
    if (this.back) this.back.negate();

    const temp = this.front;
    this.front = this.back;
    this.back = temp;
  }

  // Recursively remove all polygons in polygons that are inside this BSP tree.
  clipPolygons(polygons) {
    if (!this.plane) return polygons.slice();
    const front = [];
    let back = [];

    for (const polygon of this.polygons) {
      this.plane.splitPolygon(polygon, front, back, front, back);
    }

    if (this.front) front = this.front.clipPolygons(front);

    if (this.back) {
      back = this.back.clipPolygons(back);
    } else {
      back = [];
    }

    return front.concat(back);
  }

  // Remove all polygons in this BSP tree that are inside the other BSP tree bsp.
  clipTo(bsp) {
    this.polygons = bsp.clipPolygons(this.polygons);
    if (this.front) this.front.clipTo(bsp);
    if (this.back) this.back.clipTo(bsp);
  }

  // Return a list of all polygons in this BSP tree.
  allPolygons() {
    const polygons = this.polygons.slice();
    if (this.front)
      polygons = polygons.concat(this.front.allPolygons());
    if (this.back)
      polygons = polygons.concat(this.back.allPolygons());
    return polygons;
  }

  // Build a BSP tree out of polygons.
  // When called on an existing tree, the new polygons are filtered down
  // to the bottom of the tree and become new nodes there.
  // Each set of polygons is partitioned using the first polygon
  // (no heuristic is used to pick a good split).
  build(polygons) {
    if (!polygons.length) return;

    // start with the plane taken from an arbitrary polygon
    if (!this.plane) this.plane = polygons[0].plane.clone();
    // console.log('this.plane: ', this.plane);

    const front = [];
    const back = [];

    // console.log(this, this.polygons);

    for (const polygon of this.polygons) {
      // console.log('polygon: ', polygon);
      this.plane.splitPolygon(
        polygon,
        this.polygons,
        this.polygons,
        front,
        back,
      );
    }

    // console.log('front: ', front);
    // console.log('back: ', back);

    if (front.length) {
      // if (!this.front) this.front = new Node(front);
    }
    if (back.length) {
      // if (!this.back) this.back = new Node(back);
    }
  }
}

export { Node };
