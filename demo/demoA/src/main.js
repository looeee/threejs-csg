import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from '../../../node_modules/three/build/three.module.js';

import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

function init() {
  const container = document.querySelector('#scene-container');

  const camera = new PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 1;

  const scene = new Scene();
  scene.background = new Color('skyblue');

  const geometry = new BoxBufferGeometry(0.2, 0.2, 0.2);
  const material = new MeshNormalMaterial();

  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  renderer.setAnimationLoop(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

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
