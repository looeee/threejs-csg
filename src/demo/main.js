// This example is loosely based on https://threejs.org/examples/#webgl_loader_gltf
// with slightly improved code style
import {
  ACESFilmicToneMapping,
  Clock,
  Group,
  MathUtils,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  UnsignedByteType,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { createCSGMeshes } from "./createCSGMeshes.js";

async function init() {
  const clock = new Clock();
  const [camera, controls, renderer, scene] = setupScene();

  await setupEnvironment(renderer, scene);

  let csgMeshes;

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    if (csgMeshes) {
      csgMeshes.tick(delta);
    }
    controls.update();

    renderer.render(scene, camera);
  });

  csgMeshes = await setupMeshes();
  scene.add(csgMeshes);

  document.querySelector(".loading").style.display = "none";
  document.querySelector("header").style.height = "3rem";
}

async function setupMeshes() {
  const [originalMeshes, csgMeshes, duckCSGTest] = await createCSGMeshes();
  csgMeshes.scale.multiplyScalar(0.5);
  originalMeshes.scale.multiplyScalar(0.5);
  csgMeshes.position.set(-1.5, 0.75, -0.25);
  originalMeshes.position.set(1.5, 0.75, -0.25);

  const group = new Group();
  group.add(originalMeshes, csgMeshes, duckCSGTest);

  const radiansPerSecond = MathUtils.degToRad(20);
  group.tick = (delta) => {
    originalMeshes.rotation.x += radiansPerSecond * delta;
    originalMeshes.rotation.y += radiansPerSecond * delta;
    csgMeshes.rotation.x += radiansPerSecond * delta;
    csgMeshes.rotation.y += radiansPerSecond * delta;
    duckCSGTest.rotation.y -= radiansPerSecond * delta;
  };

  return group;
}

async function setupEnvironment(renderer, scene) {
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envTexture = await new RGBELoader()
    .setDataType(UnsignedByteType)
    .setPath("assets/environment/")
    .loadAsync("venice_sunset_1k.hdr");

  const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;

  scene.background = envMap;
  scene.environment = envMap;

  envTexture.dispose();
  pmremGenerator.dispose();
}

function setupScene() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(0, 0.5, 3);

  const scene = new Scene();

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 3;
  controls.maxDistance = 6;
  controls.target.set(0, 0.1, 0);
  controls.enableDamping = true;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return [camera, controls, renderer, scene];
}

init();
