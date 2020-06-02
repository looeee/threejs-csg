function triangulate(polygon) {
  const vertices = polygon.vertices;
  var length = vertices.length >> 1;
  if (length < 3) return [];
  if (length === 3) return [0, 1, 2];
  var triangles = [];
  var avl = [];
  for (let count = 0; count < length; count++) {
    avl.push(count);
  }

  var i = 0;
  var al = length;
  while (al > 3) {
    var i0 = avl[(i + 0) % al];
    var i1 = avl[(i + 1) % al];
    var i2 = avl[(i + 2) % al];

    var ax = vertices[2 * i0];
    var ay = vertices[2 * i0 + 1];
    var bx = vertices[2 * i1];
    var by = vertices[2 * i1 + 1];
    var cx = vertices[2 * i2];
    var cy = vertices[2 * i2 + 1];

    var earFound = false;
    if (convex(ax, ay, bx, by, cx, cy)) {
      earFound = true;
      for (var j = 0; j < al; j++) {
        var vi = avl[j];
        if (vi === i0 || vi === i1 || vi === i2) continue;
        if (
          PointInTriangle(
            vertices[2 * vi],
            vertices[2 * vi + 1],
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
          )
        ) {
          earFound = false;
          break;
        }
      }
    }
    if (earFound) {
      triangles.push(i0, i1, i2);
      avl.splice((i + 1) % al, 1);
      al--;
      i = 0;
    } else if (i++ > 3 * al) break; // no convex angles :(
  }
  triangles.push(avl[0], avl[1], avl[2]);
  return triangles;
}

export { triangulate };
