import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  MeshStandardMaterial,
  Mesh,
} from '../../../node_modules/three/build/three.module.js';

import { CSG } from '../../../build/csg.module.js';

function testCSG(params) {
  const red = new MeshStandardMaterial({ color: 'orangered' });
  const green = new MeshStandardMaterial({ color: 'seagreen' });
  const blue = new MeshStandardMaterial({ color: 'lightblue' });

  const box = new Mesh(new BoxBufferGeometry(0.2, 0.2, 1), blue);
  box.position.set(0.1, 0.1, 0);

  const sphere = new Mesh(new SphereBufferGeometry(0.1), red);
  sphere.position.set(0, 0, -0.3);

  const sphereB = sphere.clone();
  sphereB.position.set(0, 0, 0.3);

  const testSphereBoxMeshes = () => {
    const csg = new CSG();
    // csg.union([box, sphere, sphereB]);
    // csg.subtract([box, sphere, sphereB]);
    csg.intersect([box, sphere]);
    console.log('csg: ', csg);

    return csg;
  };

  // const test = testTriangle();
  // const test = testBox();
  // const test = testSphereBox();
  const test = testSphereBoxMeshes();

  return {
    // plane: planeCSG.toGeometry(),
    // box: boxCSG.toGeometry(),
    // boxB: boxBCSG.toGeometry(),
    // cylinder: cylinderCSG.toGeometry(),
    // sphere: sphereCSG.toGeometry(),
    // test: test.toGeometry(),
    testMesh: test.toMesh(),
  };
}

export { testCSG };
