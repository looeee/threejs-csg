import {
  BoxBufferGeometry,
  CylinderBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
} from '../../../node_modules/three/build/three.module.js';

import { CSG } from '../../../build/csg.module.js';

function testCSG(params) {
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

  const box = new Mesh(new BoxBufferGeometry(0.2, 0.2, 1), uvBW);

  box.position.set(0.1, 0.1, 0);

  const sphere = new Mesh(new SphereBufferGeometry(0.1), red);
  sphere.position.set(0, 0, -0.3);

  const sphereB = sphere.clone();
  sphereB.position.set(0, 0, 0.3);

  const csg = new CSG();
  // csg.union([box, sphere, sphereB]);
  // csg.subtract([box, sphere, sphereB]);
  csg.intersect([box, sphere]);
  console.log('csg: ', csg);

  return {
    testMesh: csg.toMesh(),
  };
}

export { testCSG };
