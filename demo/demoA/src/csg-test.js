import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  MeshNormalMaterial,
} from '../../../node_modules/three/build/three.module.js';

import { CSG } from '../../../build/csg.module.js';

function createGeo(positions) {
  const geometry = new BufferGeometry();

  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(positions), 3),
  );

  return geometry;
}

function testCSG(params) {
  // prettier-ignore
  const triangle = createGeo([
    -0.2, -0.2,  0,
    0.2, -0.2,  0,
    0.2,  0.2,  0,
  ] );

  // prettier-ignore
  const triangleUp = createGeo([
    -0.2, -0.2,  0,
    0.2,  0.2,  0,
    -0.2, 0.2,  0,
  ] );

  // prettier-ignore
  const square = createGeo([
    -0.2, -0.2,  0,
    0.2, -0.2,  0,
    0.2,  0.2,  0,

    0.2,  0.2,  0,
    -0.2,  0.2,  0,
    -0.2, -0.2,  0
  ]);

  const box = new BoxBufferGeometry(0.2, 0.2, 1);
  const cylinder = new CylinderBufferGeometry(0.2, 0.2, 1);
  const plane = new PlaneBufferGeometry(0.2, 0.2);
  const sphere = new SphereBufferGeometry(0.2);

  const triangleCSG = new CSG().fromGeometry(triangle);
  const triangleUpCSG = new CSG().fromGeometry(triangleUp);
  const squareCSG = new CSG().fromGeometry(square);
  const planeCSG = new CSG().fromGeometry(plane);
  // console.log('planeCSG: ', plane, planeCSG);
  const boxCSG = new CSG().fromGeometry(box);
  const boxBCSG = new CSG().fromGeometry(
    new BoxBufferGeometry(0.3, 0.3, 0.3),
  );
  console.log('boxCSG: ', box, boxCSG);
  const cylinderCSG = new CSG().fromGeometry(cylinder);
  // console.log('cylinderCSG: ', cylinder, cylinderCSG);
  const sphereCSG = new CSG().fromGeometry(sphere);
  // console.log('sphereCSG: ', sphere, sphereCSG);

  // const basic = triangleCSG.subtract(squareCSG);
  // const basic = squareCSG.subtract(triangleCSG);
  const basic = triangleCSG.union(triangleUpCSG);
  // // console.log('basic: ', basic);

  // console.log(
  //   'triangle: ',
  //   triangleCSG.toGeometry().attributes.position.array,
  // );
  // console.log(
  //   'triangleUp: ',
  //   triangleUpCSG.toGeometry().attributes.position.array,
  // );
  // console.log(
  //   'basic: ',
  //   basic.toGeometry().attributes.position.array,
  // );

  // const subTest = boxCSG.union(boxBCSG);
  // const subTest = boxCSG.subtract(boxBCSG);
  // const subTest = boxCSG.subtract(boxBCSG);
  // console.log('subTest: ', subTest);

  return {
    triangle: triangleCSG.toGeometry(),
    triangleUp: triangleUpCSG.toGeometry(),
    triangleOrig: triangle,
    square: squareCSG.toGeometry(),
    squareOrig: square,
    plane: planeCSG.toGeometry(),
    planeOrig: plane.toNonIndexed(),
    box: boxCSG.toGeometry(),
    boxB: boxBCSG.toGeometry(),
    boxOrig: box.toNonIndexed(),
    cylinder: cylinderCSG.toGeometry(),
    cylinderOrig: cylinder.toNonIndexed(),
    sphere: sphereCSG.toGeometry(),
    sphereOrig: sphere.toNonIndexed(),
    basic: basic.toGeometry(),
    // subTest: subTest.toGeometry(),
  };
}

export { testCSG };
