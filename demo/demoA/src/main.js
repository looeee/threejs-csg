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

  const results = testCSG();

  const material = new MeshNormalMaterial();
  // const material = new MeshNormalMaterial({ side: DoubleSide });

  const plane = new Mesh(results.plane, material);
  plane.position.set(1, 1, 0);

  const box = new Mesh(results.box, material);
  box.position.set(-1, 0, 0);
  const boxB = new Mesh(results.boxB, material);
  boxB.position.set(-0.5, 0, 0);

  const cylinder = new Mesh(results.cylinder, material);
  cylinder.position.set(1, -1, 0);

  const sphere = new Mesh(results.sphere, material);
  sphere.position.set(-1, -1, 0);

  const test = new Mesh(results.test, material);
  test.position.set(1, 0, 0);

  scene.add(
    plane,
    box,
    boxB,
    cylinder,
    sphere,
    test,
    results.testMesh,
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
