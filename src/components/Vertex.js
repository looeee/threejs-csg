// Represents a vertex of a polygon.
// TODO: vertex colors
class Vertex {
  constructor(position, normal, uv) {
    this.position = position;
    this.normal = normal;
    this.uv = uv;
  }

  clone() {
    return new Vertex(this.position, this.normal, this.uv);
  }

  // Invert all orientation-specific data (e.g. vertex normal).
  // Called when the orientation of a polygon is flipped.
  negate() {
    this.normal = this.normal.negate();
  }

  // Create a new vertex between this vertex and v
  // by linearly interpolating all properties using a parameter of t
  interpolate(v, t) {
    return new Vertex(
      this.position.lerp(v.position, t),
      this.normal.lerp(v.normal, t),
      // verify that lerp is correct for UVs
      this.uv.lerp(v.uv, t),
    );
  }
}

export { Vertex };
