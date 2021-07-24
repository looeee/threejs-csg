# threejs-csg (Experimental)

Constructive Solid Geometry for three.js, ES6 + BufferGeometry.

Note: I have stopped working on this for now and there are bugs, although it should work for simple shapes. 
If you need a more complete library that works with BufferGeometry try [SebiTimeWaster /
three-csg](https://github.com/SebiTimeWaster/three-csg).
# Developing

Run `npm install` then `npm start`

To view the demo, direct your browser to
http://127.0.0.1:8080/demo/tests/index.html

# Usage

```
const box = new Mesh(new BoxBufferGeometry(0.2, 0.2, 1), material);
box.position.set(0.1, 0.1, 0);

const sphere = new Mesh(new SphereBufferGeometry(0.1), material);
sphere.position.set(0, 0, -0.3);

const sphereB = sphere.clone();
sphereB.position.set(0, 0, 0.3);

const csg = new CSG();

csg.subtract([box, sphere, sphereB]);
// csg.union([box, sphere, sphereB]);
// csg.intersect([box, sphere]);

const resultMesh = csg.toMesh();
```

# TODO

* Only the material from the first mesh is used.
* Vertex colors are ignored.
* Make it faster!! 

# Prior Work

http://evanw.github.io/csg.js/docs

https://github.com/jscad/csg.js

http://sandervanrossen.blogspot.com/2010/05/csg-operations.html

https://www.geometrictools.com/Documentation/ClipMesh.pdf
