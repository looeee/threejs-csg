// # class Vertex

// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property and `clone()`,
// `flip()`, and `interpolate()` methods that behave analogous to the ones
// defined by `Vertex`. This class provides `normal` so convenience
// functions like `CSG.sphere()` can return a smooth vertex normal, but `normal`
// is not used anywhere else.

class Vertex {
  constructor(pos, normal, uv) {
    this.pos = pos;
    if (normal) this.normal = normal;
    if (uv) this.uv = uv;
  }
  clone() {
    return new Vertex(
      this.pos.clone(),
      this.normal && this.normal.clone(),
      this.uv && this.uv.clone(),
    );
  }

  // Invert all orientation-specific data (e.g. vertex normal). Called when the
  // orientation of a polygon is flipped.
  negate() {
    this.normal = this.normal && this.normal.negate();
  }

  // Create a new vertex between this vertex and `other` by linearly
  // interpolating all properties using a parameter of `t`. Subclasses should
  // override this to interpolate additional properties.
  interpolate(other, t) {
    let normal = null;
    if (this.normal && other.normal) {
      normal = this.normal.clone().lerp(other.normal, t);
    }
    let uv = null;
    if (this.uv && other.uv) {
      uv = this.uv.clone().lerp(other.uv, t);
    }

    return new Vertex(
      this.pos.clone().lerp(other.pos, t),
      normal,
      uv,
    );
  }
}

export { Vertex };
