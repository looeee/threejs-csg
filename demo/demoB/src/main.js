import {
  BoxBufferGeometry,
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

import { testCSG } from './csg-test.js';

function init() {
  const container = document.querySelector('#scene-container');

  const camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(-1, 2, 5);

  const scene = new Scene();
  scene.background = new Color('skyblue');

  // scene.overrideMaterial = new MeshBasicMaterial({
  //   color: 'grey',
  //   side: DoubleSide,
  //   wireframe: true,
  // });

  const geometries = testCSG();
  // console.log('geometries: ', geometries);

  const material = new MeshNormalMaterial({ side: DoubleSide });

  const triangle = new Mesh(geometries.triangle, material);
  triangle.position.set(-1, 1, 0);
  const triangleUp = new Mesh(geometries.triangleUp, material);
  triangleUp.position.set(-0.5, 1, 0);

  const square = new Mesh(geometries.square, material);
  square.position.set(0, 1, 0);

  const plane = new Mesh(geometries.plane, material);
  plane.position.set(1, 1, 0);

  const box = new Mesh(geometries.box, material);
  box.position.set(-1, 0, 0);
  const boxB = new Mesh(geometries.boxB, material);
  boxB.position.set(-0.5, 0, 0);

  const cylinder = new Mesh(geometries.cylinder, material);
  cylinder.position.set(1, -1, 0);

  const sphere = new Mesh(geometries.sphere, material);
  sphere.position.set(-1, -1, 0);

  // tri
  // -0.2, -0.2,  0.2,
  // 0.2, -0.2,  0.2,
  // 0.2,  0.2,  0.2,

  // basic
  // 0.2,  0.2,  0.2,
  // 0.2,  -0.2,  0.2,
  // -0.2,  -0.2,  0.2,

  const test = new Mesh(geometries.test, material);
  test.position.set(0, 0, 0);
  // console.log(
  //   'geometries.basic: ',
  //   geometries.basic.attributes.position.array,
  // );

  scene.add(
    triangle,
    triangleUp,
    square,
    plane,
    box,
    boxB,
    cylinder,
    sphere,
    test,
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
