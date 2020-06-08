# threejs-csg

Constructive Solid Geometry for three.js, ES6 + BufferGeometry

# Developing

Run `npm install` then `npm start`

To view the demo, direct your browser to
http://127.0.0.1:8080/demo/tests/index.html

# Usage

```
const box = new Mesh(new BoxBufferGeometry(0.2, 0.2, 1), material);
// console.log('box: ', new BoxBufferGeometry(0.2, 0.2, 1));
box.position.set(0.1, 0.1, 0);

const sphere = new Mesh(new SphereBufferGeometry(0.1), material);
sphere.position.set(0, 0, -0.3);

const sphereB = sphere.clone();
sphereB.position.set(0, 0, 0.3);

const csg = new CSG();

csg.setFromMesh(box);
csg.union([sphere, sphereB]);
=> equivalent to (if no mesh is set, the first mesh in the array is used)
csg.union([box, sphere, sphereB]);

// csg.subtract([box, sphere, sphereB]);
// csg.intersect([box, sphere]);

const resultMesh = csg.toMesh();
```

# TODO

* Only the material from the first mesh is used.
* Vertex colors are ignored.
* Very slow

# Prior Work

http://evanw.github.io/csg.js/docs

https://github.com/jscad/csg.js

http://sandervanrossen.blogspot.com/2010/05/csg-operations.html

https://www.geometrictools.com/Documentation/ClipMesh.pdf