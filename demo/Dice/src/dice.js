import {
  AmbientLight,
  BoxBufferGeometry,
  SphereBufferGeometry,
  CylinderBufferGeometry,
  MeshStandardMaterial,
  DirectionalLight,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
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

  const sphereDimple = new SphereBufferGeometry(19.5, 32, 16);
  const sphere = new SphereBufferGeometry(7.5, 32, 16);
  const cylinder = new CylinderBufferGeometry(7.5, 7.5, 85, 32);
  const box = new BoxBufferGeometry(100, 85, 85);
  const dimpleColor = new Color(0.25, 0.25, 0.25);

  // let cube = CSG.union([
  //   box,
  //   box.clone().rotateY(ninetyDegrees),
  //   box.clone().rotateZ(ninetyDegrees),
  // ]);

  const boxCSG_A = new CSG().setFromGeometry(box);
  const boxCSG_B = new CSG().setFromGeometry(
    box.clone().rotateY(ninetyDegrees),
  );
  const boxCSG_C = new CSG().setFromGeometry(
    box.clone().rotateZ(ninetyDegrees),
  );
  // const sphereCornerCSG = new CSG().setFromGeometry(sphere);
  const cylinderCSG = new CSG().setFromGeometry(cylinder);

  let dice = boxCSG_A.union(boxCSG_B).union(boxCSG_C);

  const createRoundedCube = (x) => {
    // const operations = [cube];
    if (x < 8) {
      sphere
        .center()
        .translate(
          moduloSwitch(x, 1),
          moduloSwitch(x, 2),
          moduloSwitch(x, 4),
        );
      const cornerCSG = new CSG().setFromGeometry(sphere);
      dice = dice.union(cornerCSG);
    }

    if (x < 4) {
      const cylinderCSG = new CSG().setFromGeometry(
        cylinder
          .clone()
          .center()
          .translate(moduloSwitch(x, 1), 0, moduloSwitch(x, 2)),
      );
      dice = dice.union(cylinderCSG);
    }
    // if (x > 3 && x < 8)
    //   operations.push(
    //     cylinder
    //       .center()
    //       .translate(moduloSwitch(x, 1), moduloSwitch(x, 2), 0),
    //   );
    // if (x > 7)
    //   operations.push(
    //     cylinder
    //       .center()
    //       .translate(0, moduloSwitch(x, 1), moduloSwitch(x, 2)),
    //   );
    // cube = CSG.union(operations);
    // if (x === 3) cylinder.rotateX(ninetyDegrees);
    // if (x === 7) cylinder.rotateY(ninetyDegrees);
  };

  const createDimples = (dimple) => {
    if (dimple[3]) sphereDimple.rotateX(ninetyDegrees);
    cube = CSG.subtract(
      [
        cube,
        sphereDimple
          .center()
          .translate(dimple[0], dimple[1], dimple[2]),
      ],
      [null, dimpleColor],
    );
  };

  const start = new Date().getTime();

  let x = 0;
  const steps = () => {
    if (x < 12) createRoundedCube(x);
    // if (x > 11 && x < 33) createDimples(dimpleData[x - 12]);
    if (x < 33) setTimeout(steps, 0);
    else
      document.querySelector('.time').innerHTML =
        (new Date().getTime() - start) / 1000;
    x++;
  };
  steps();

  return dice.toGeometry();
}

export { createDice };
