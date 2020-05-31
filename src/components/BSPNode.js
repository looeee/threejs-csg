import { Shape } from './Shape.js';

// Holds a node in a BSP tree AKA adaptive partitioning tree.
// A BSP tree is built from a collection of polygons by picking a polygon to split along.
// That polygon (and all other coplanar polygons) are added directly to that
// node and the other polygons are added to the front and/or back subtrees.
// This is not a leafy BSP tree since there is no distinction between internal and leaf nodes.
class BSPNode {
  constructor(polygons) {
    // console.log('new Node', polygons);
    this.plane = null;
    this.frontNode = null;
    this.backNode = null;
    this.polygons = [];

    if (polygons) this.build(polygons);
  }

  clone() {
    const node = new BSPNode();
    node.plane = this.plane && this.plane.clone();
    node.frontNode = this.frontNode && this.frontNode.clone();
    node.backNode = this.backNode && this.backNode.clone();
    node.polygons = this.polygons.map((p) => p.clone());
    return node;
  }

  // Invert the node
  negate() {
    for (const polygon of this.polygons) {
      polygon.negate();
    }

    this.plane.negate();
    if (this.frontNode) this.frontNode.negate();
    if (this.backNode) this.backNode.negate();

    const temp = this.frontNode;
    this.frontNode = this.backNode;
    this.backNode = temp;
  }

  // Recursively remove all polygons in polygons that are inside this BSP tree.
  clipPolygons(polygons) {
    if (!this.plane) return polygons.slice();

    let frontPolygons = [];
    let backPolygons = [];

    for (const polygon of polygons) {
      this.plane.splitPolygon(
        polygon,
        frontPolygons, // coplanar front
        backPolygons, // coplanar back
        frontPolygons,
        backPolygons,
      );
    }

    if (this.frontNode) {
      frontPolygons = this.frontNode.clipPolygons(frontPolygons);
    }

    if (this.backNode) {
      backPolygons = this.backNode.clipPolygons(backPolygons);
    } else {
      backPolygons = [];
    }

    return frontPolygons.concat(backPolygons);
  }

  // Remove all polygons in this BSP tree that are inside the other BSP tree bsp.
  clipTo(bsp) {
    this.polygons = bsp.clipPolygons(this.polygons);
    if (this.frontNode) this.frontNode.clipTo(bsp);
    if (this.backNode) this.backNode.clipTo(bsp);
  }

  // Return a list of all polygons in this BSP tree.
  allPolygons() {
    let polygons = this.polygons.slice();
    if (this.frontNode)
      polygons = polygons.concat(this.frontNode.allPolygons());
    if (this.backNode)
      polygons = polygons.concat(this.backNode.allPolygons());
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
    if (!this.plane) {
      this.plane = polygons[0].plane.clone();
    }

    const frontPolygons = [];
    const backPolygons = [];

    for (const polygon of polygons) {
      this.plane.splitPolygon(
        polygon,
        // coplanar polygons are stored in this node
        this.polygons, // coplanar front
        this.polygons, // coplanar back
        frontPolygons,
        backPolygons,
      );
    }

    if (frontPolygons.length) {
      if (!this.frontNode)
        this.frontNode = new BSPNode(frontPolygons);
    }
    if (backPolygons.length) {
      if (!this.backNode) this.backNode = new BSPNode(backPolygons);
    }
  }
}

export { BSPNode };
