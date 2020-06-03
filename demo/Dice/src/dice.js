import {
  BoxBufferGeometry,
  SphereBufferGeometry,
  CylinderBufferGeometry,
  MeshStandardMaterial,
  Color,
  Mesh,
  TextureLoader,
} from '../../../node_modules/three/build/three.module.js';

import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import { CSG } from '../../../build/csg.module.js';

function createDice() {
  const ninetyDegrees = Math.PI / 2;
  const moduloSwitch = (x, interval) =>
    x % (interval * 2) < interval ? 42.5 : -42.5;

  /*
   * create a dice with three-csg
   */

  // data where the dimples should be set on the dice
  const dimpleData = [
    [-67, 25, 25], // face 2
    [-67, -25, -25],
    [0, 0, 67], // face 3
    [-25, 25, 67],
    [25, -25, 67],
    [25, 25, -67], // face 4
    [-25, 25, -67],
    [25, -25, -67],
    [-25, -25, -67],
    [67, 0, 0], // face 5
    [67, 25, 25],
    [67, -25, 25],
    [67, 25, -25],
    [67, -25, -25],
    [20, 67, 25, true], // face 6
    [-20, 67, -25],
    [-20, 67, 25],
    [20, 67, -25],
    [20, 67, 0],
    [-20, 67, 0],
    [0, -67, 0], // face 1
  ];

  const loader = new TextureLoader();
  const textureBW = loader.load(
    '/demo/assets/textures/uv-test-bw.png',
  );
  const textureCol = loader.load(
    '/demo/assets/textures/uv-test-col.png',
  );

  const red = new MeshStandardMaterial({ color: 'orangered' });
  const green = new MeshStandardMaterial({ color: 'seagreen' });
  const blue = new MeshStandardMaterial({ color: 'lightblue' });
  const uvBW = new MeshStandardMaterial({ map: textureBW });
  const uvCol = new MeshStandardMaterial({ map: textureCol });

  const dimple = new Mesh(
    new SphereBufferGeometry(19.5, 32, 16),
    uvBW,
  );
  const sphere = new Mesh(
    new SphereBufferGeometry(7.5, 32, 16),
    uvBW,
  );
  const cylinder = new Mesh(
    new CylinderBufferGeometry(7.5, 7.5, 85, 32),
    uvBW,
  );
  const box = new Mesh(new BoxBufferGeometry(100, 85, 85), uvBW);

  const dimpleColor = new Color(0.25, 0.25, 0.25);

  let dice = new CSG().union([
    box,
    box.clone().rotateY(ninetyDegrees),
    box.clone().rotateZ(ninetyDegrees),
  ]);

  const unionOperands = [];
  const subtractionOperands = [];

  const createRoundedCube = (x) => {
    if (x < 8) {
      const corner = sphere.clone();
      corner.position.set(
        moduloSwitch(x, 1),
        moduloSwitch(x, 2),
        moduloSwitch(x, 4),
      );
      unionOperands.push(corner);
    }
    if (x < 4) {
      const edge = cylinder.clone();
      edge.position.set(moduloSwitch(x, 1), 0, moduloSwitch(x, 2));
      unionOperands.push(edge);
    }
    if (x === 3) {
      cylinder.rotateX(ninetyDegrees);
    }
    if (x > 3 && x < 8) {
      const edge = cylinder.clone();
      edge.position.set(moduloSwitch(x, 1), moduloSwitch(x, 2), 0);
      unionOperands.push(edge);
    }
    if (x > 7) {
      const edge = cylinder.clone();
      edge.position.set(0, moduloSwitch(x, 1), moduloSwitch(x, 2));
      edge.rotateZ(ninetyDegrees);
      unionOperands.push(edge);
    }
  };

  const createDimples = (dimplePos) => {
    if (dimplePos[3]) dimple.rotateX(ninetyDegrees);
    const currentDimple = dimple.clone();
    currentDimple.position.set(
      dimplePos[0],
      dimplePos[1],
      dimplePos[2],
    );
    subtractionOperands.push(currentDimple);
  };

  const start = new Date().getTime();

  for (let i = 0; i < 34; i++) {
    if (i < 12) createRoundedCube(i);
    if (i > 11 && i < 16) createDimples(dimpleData[i - 12]);
    // if (i > 11 && i < 33) createDimples(dimpleData[i - 12]);
  }
  dice.union(unionOperands);
  // dice.subtract(subtractionOperands);
  console.log('subtractionOperands: ', subtractionOperands);

  document.querySelector('.time').innerHTML =
    (new Date().getTime() - start) / 1000;

  return dice.toGeometry();
}

export { createDice };
