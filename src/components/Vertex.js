// Represents a vertex of a polygon.
// TODO: vertex colors
class Vertex {
  constructor(position, normal = null, uv = null) {
    this.position = position;
    this.normal = normal;
    this.uv = uv;
  }

  clone() {
    return new Vertex(
      this.position.clone(),
      this.normal && this.normal.clone(),
      this.uv && this.uv.clone(),
    );
  }

  // Invert all orientation-specific data (e.g. vertex normal).
  // Called when the orientation of a polygon is flipped.
  negate() {
    if (this.normal) this.normal = this.normal.negate();
  }

  // Create a new vertex between this vertex and v
  // by linearly interpolating all properties using a parameter of t
  interpolate(v, t) {
    const normal = this.normal ? this.normal.lerp(v.normal, t) : null;
    const uv = this.uv ? this.uv.lerp(v.uv, t) : null;
    return new Vertex(
      this.position.lerp(v.position, t),
      normal,
      // verify that lerp is correct for UVs
      uv,
    );
  }
}

export { Vertex };
