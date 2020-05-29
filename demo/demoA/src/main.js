import {
  BoxBufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from '../../../node_modules/three/build/three.module.js';

import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import { testCSG } from './csg-test.js';

function init() {
  const container = document.querySelector('#scene-container');

  const camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 5;

  const scene = new Scene();
  scene.background = new Color('skyblue');

  const geometries = testCSG();
  // console.log('geometries: ', geometries);

  const material = new MeshNormalMaterial({ side: DoubleSide });

  const triangle = new Mesh(geometries.triangle, material);
  triangle.position.set(-1, 1, 0);
  const triangleOrig = new Mesh(geometries.triangleOrig, material);
  triangleOrig.position.set(-0.5, 1, 0);

  const square = new Mesh(geometries.square, material);
  square.position.set(0, 1, 0);
  const squareOrig = new Mesh(geometries.squareOrig, material);
  squareOrig.position.set(0.5, 1, 0);

  const plane = new Mesh(geometries.plane, material);
  plane.position.set(1, 1, 0);
  const planeOrig = new Mesh(geometries.planeOrig, material);
  planeOrig.position.set(1.5, 1, 0);

  const box = new Mesh(geometries.box, material);
  box.position.set(-1, 0, 0);
  const boxOrig = new Mesh(geometries.boxOrig, material);
  boxOrig.position.set(-0.5, 0, 0);

  const cylinder = new Mesh(geometries.cylinder, material);
  cylinder.position.set(0, 0, 0);
  const cylinderOrig = new Mesh(geometries.cylinderOrig, material);
  cylinderOrig.position.set(0.5, 0, 0);

  const sphere = new Mesh(geometries.sphere, material);
  sphere.position.set(-1, -1, 0);
  const sphereOrig = new Mesh(geometries.sphereOrig, material);
  sphereOrig.position.set(-0.5, -1, 0);

  // const subTest = new Mesh(geometries.subTest, material);
  // subTest.position.set(1, -1, 0);
  // console.log('geometries.subTest: ', geometries.subTest);

  // tri
  // -0.2, -0.2,  0.2,
  // 0.2, -0.2,  0.2,
  // 0.2,  0.2,  0.2,

  // basic
  // 0.2,  0.2,  0.2,
  // 0.2,  -0.2,  0.2,
  // -0.2,  -0.2,  0.2,

  const basic = new Mesh(geometries.basic, material);
  basic.position.set(1, -1, 0);
  // console.log(
  //   'geometries.basic: ',
  //   geometries.basic.attributes.position.array,
  // );

  scene.add(
    triangle,
    triangleOrig,
    square,
    squareOrig,
    plane,
    planeOrig,
    box,
    boxOrig,
    cylinder,
    cylinderOrig,
    sphere,
    sphereOrig,
    basic,
    // subTest,
  );

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  });
}

init();
