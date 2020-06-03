import {
  AmbientLight,
  DirectionalLight,
  BoxBufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from '../../../node_modules/three/build/three.module.js';

import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import { createDice } from './dice.js';

function init() {
  const container = document.querySelector('#scene-container');

  const camera = new PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    1,
    1000,
  );
  camera.position.set(-40, 50, 300);

  const scene = new Scene();
  scene.background = new Color('skyblue');

  const ambient = new AmbientLight(0xffffff, 0.4);
  const direct = new DirectionalLight(0xffffff, 0.6);

  scene.add(ambient, direct);

  // scene.overrideMaterial = new MeshBasicMaterial({
  //   color: 'grey',
  //   side: DoubleSide,
  //   wireframe: true,
  // });

  const material = new MeshStandardMaterial({
    color: 0xffffff0,
    roughness: 0.0,
    metalness: 0.0,
    // vertexColors: true,
  });

  const diceGeometry = createDice();
  const dice = new Mesh(diceGeometry, material);

  scene.add(dice);

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
