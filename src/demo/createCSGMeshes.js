import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  SphereBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
  Group,
  MathUtils,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { CSG } from "../CSG/CSG.js";

async function loadModel() {
  const gltf = await new GLTFLoader().loadAsync("/assets/models/quack.glb");
  const model = gltf.scene.getObjectByName("LOD3spShape");

  return [model];
}

function createMaterials() {
  const loader = new TextureLoader();
  const textureBW = loader.load("/assets/textures/uv-test-bw.png");
  const textureCol = loader.load("/assets/textures/uv-test-col.png");

  const red = new MeshStandardMaterial({ color: "orangered" });
  const green = new MeshStandardMaterial({ color: "seagreen" });
  const blue = new MeshStandardMaterial({ color: "lightblue" });
  const uvBW = new MeshStandardMaterial({ map: textureBW });
  const uvCol = new MeshStandardMaterial({ map: textureCol });

  return { red, green, blue, uvBW, uvCol };
}

async function createDuckCSGTest(materials) {
  const [duck] = await loadModel();
  duck.position.y = -1;
  duck.rotation.y = -Math.PI / 3;
  duck.scale.multiplyScalar(0.01);

  duck.material = materials.uvCol;

  const box = new Mesh(new BoxBufferGeometry(1, 1, 1), materials.red);
  box.position.set(0.75, -0.75, 0);

  const sphere = new Mesh(new SphereBufferGeometry(0.25), materials.blue);
  sphere.position.set(0, -0.1, -0.5);

  const sphereB = new Mesh(new SphereBufferGeometry(0.25), materials.red);
  sphereB.position.set(0, -0.25, 0.5);

  const cylinder = new Mesh(
    new CylinderBufferGeometry(0.1, 0.1, 2, 16),
    materials.red
  );
  cylinder.rotation.set(Math.PI / 2, 0, 0);
  cylinder.position.set(0, 0.5, 0);

  console.time("Performing CSG operations on Duck model: ");

  // We can either perform CSG operations one by one
  // const duckCSG = new CSG().setFromMesh(duck);
  // const sphereCSG = new CSG().setFromMesh(sphere);
  // const sphereBCSG = new CSG().setFromMesh(sphereB);
  // const cylinderCSG = new CSG().setFromMesh(cylinder);
  // const boxCSG = new CSG().setFromMesh(box);

  // duckCSG.subtractOperand(sphereCSG);
  // duckCSG.subtractOperand(sphereBCSG);
  // duckCSG.subtractOperand(cylinderCSG);
  // duckCSG.subtractOperand(boxCSG);

  // const csgMesh = duckCSG.toMesh();

  // Or (faster) we can do them all at once by passing in an array meshes
  const csg = new CSG();
  csg.subtract([duck, sphere, sphereB, cylinder, box]);
  const csgMesh = csg.toMesh();
  console.timeEnd("Performing CSG operations on Duck model: ");
  // console.log("csg: ", csgMesh);

  return csgMesh;
}

function createMeshesCSGTest(materials) {
  const outerSphere = new Mesh(
    new SphereBufferGeometry(0.75, 12, 12),
    materials.uvCol
  );
  const innerSphere = new Mesh(new SphereBufferGeometry(0.7), materials.uvCol);

  const cylinder = new Mesh(
    new CylinderBufferGeometry(0.25, 0.25, 3, 16),
    materials.red
  );
  cylinder.rotation.set(Math.PI / 2, 0, 0);
  cylinder.position.set(0, 0, 0);

  const operands = [outerSphere, innerSphere, cylinder];

  for (let i = 0; i < 12; i++) {
    const newCylinder = cylinder.clone();
    newCylinder.scale.multiplyScalar(MathUtils.randFloat(0.5, 1));

    newCylinder.rotation.set(
      Math.PI / 2 + MathUtils.randFloat(-Math.PI / 2, Math.PI / 2),
      MathUtils.randFloat(-Math.PI / 2, Math.PI / 2),
      MathUtils.randFloat(-Math.PI / 2, Math.PI / 2)
    );

    operands.push(newCylinder);
  }

  console.time("Performing CSG operations on meshes: ");

  // We can either perform CSG operations one by one
  // const sphereCSG = new CSG().setFromMesh(sphere);
  // const sphereBCSG = new CSG().setFromMesh(sphereB);
  // const cylinderCSG = new CSG().setFromMesh(cylinder);
  // const boxCSG = new CSG().setFromMesh(box);

  // duckCSG.subtractOperand(sphereCSG);
  // duckCSG.subtractOperand(sphereBCSG);
  // duckCSG.subtractOperand(cylinderCSG);
  // duckCSG.subtractOperand(boxCSG);

  // const csgMesh = duckCSG.toMesh();

  // Or (faster) we can do them all at once by passing in an array meshes
  const csg = new CSG();
  csg.subtract(operands);
  const csgMeshes = csg.toMesh();
  console.timeEnd("Performing CSG operations on meshes: ");

  const originalMeshes = new Group();
  originalMeshes.add(...operands);

  return [originalMeshes, csgMeshes];
}

async function createCSGMeshes() {
  const materials = createMaterials();
  const [originalMeshes, csgMeshes] = createMeshesCSGTest(materials);
  const duckCSGTest = await createDuckCSGTest(materials);

  return [originalMeshes, csgMeshes, duckCSGTest];
}

export { createCSGMeshes };
