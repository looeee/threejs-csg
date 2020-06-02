// # class Vector

// Represents a 3D vector.
//
// Example usage:
//
//     new Vector(1, 2, 3);
//     new Vector([1, 2, 3]);
//     new Vector({ x: 1, y: 2, z: 3 });

class Vector {
  constructor(x, y, z) {
    if (arguments.length == 3) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else if ('x' in x) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    }
  }
  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  negated() {
    return new Vector(-this.x, -this.y, -this.z);
  }

  plus(a) {
    return new Vector(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  minus(a) {
    return new Vector(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  times(a) {
    return new Vector(this.x * a, this.y * a, this.z * a);
  }

  dividedBy(a) {
    return new Vector(this.x / a, this.y / a, this.z / a);
  }

  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  lerp(a, t) {
    return this.plus(a.minus(this).times(t));
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  unit() {
    return this.dividedBy(this.length());
  }

  cross(a) {
    return new Vector(
      this.y * a.z - this.z * a.y,
      this.z * a.x - this.x * a.z,
      this.x * a.y - this.y * a.x,
    );
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;

    return array;
  }
}

export { Vector };
