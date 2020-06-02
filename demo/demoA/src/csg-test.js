import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  MeshNormalMaterial,
  Mesh,
} from '../../../node_modules/three/build/three.module.js';

import { CSG } from '../../../build/csg.module.js';

function testCSG(params) {
  const material = new MeshNormalMaterial();
  const planeCSG = new CSG().setFromGeometry(
    new PlaneBufferGeometry(0.2, 0.2),
  );
  // console.log('planeCSG: ', plane, planeCSG);
  const boxCSG = new CSG().setFromGeometry(
    new BoxBufferGeometry(0.2, 0.2, 1),
  );
  const boxBCSG = new CSG().setFromGeometry(
    new BoxBufferGeometry(0.3, 0.3, 0.3),
  );
  const cylinderCSG = new CSG().setFromGeometry(
    new CylinderBufferGeometry(0.2, 0.2, 1),
  );
  // console.log('cylinderCSG: ', cylinder, cylinderCSG);
  const sphereCSG = new CSG().setFromGeometry(
    new SphereBufferGeometry(0.2),
  );
  // console.log('sphereCSG: ', sphere, sphereCSG);

  const boxMesh = new Mesh(
    new BoxBufferGeometry(0.2, 0.2, 1),
    material,
  );
  boxMesh.position.set(0.1, 0.1, 0);

  const sphereMesh = new Mesh(
    new SphereBufferGeometry(0.2),
    material,
  );

  const boxMCSG = new CSG().setFromMesh(boxMesh);
  const sphereMCSG = new CSG().setFromMesh(sphereMesh);

  const testBox = () => {
    // console.log('boxCSG: ', box, boxCSG);
    const test = boxCSG.union(boxBCSG);
    // const test = boxCSG.subtract(boxBCSG);
    // const test = boxCSG.intersect(boxBCSG);
    // console.log('test: ', test.polygons);
    // console.log('test: ', test.toGeometry().attributes.position);

    return test;
  };

  const testSphereBox = () => {
    // console.log('boxCSG: ', box, boxCSG);
    // const test = boxCSG.union(sphereCSG);
    const test = boxCSG.subtract(sphereCSG);
    // const test = boxCSG.intersect(sphereCSG);

    // console.log('test: ', test.polygons);
    // console.log('test: ', test.toGeometry().attributes.position);

    return test;
  };

  const testSphereBoxMeshes = () => {
    // console.log('boxMCSG: ', box, boxCSG);
    // const test = boxMCSG.union(sphereMCSG);
    const test = boxMCSG.subtract(sphereMCSG);
    // const test = boxMCSG.intersect(sphereMCSG);

    return test;
  };

  // const test = testTriangle();
  // const test = testBox();
  // const test = testSphereBox();
  const test = testSphereBoxMeshes();

  return {
    plane: planeCSG.toGeometry(),
    box: boxCSG.toGeometry(),
    boxB: boxBCSG.toGeometry(),
    cylinder: cylinderCSG.toGeometry(),
    sphere: sphereCSG.toGeometry(),
    test: test.toGeometry(),
    testMesh: test.toMesh(),
  };
}

export { testCSG };
