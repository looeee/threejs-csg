import * as THREE from '../../../node_modules/three/build/three.module.js';

import { CSG } from '../../../build/csg.module.js';

function testCSG(params) {
  const loader = new THREE.TextureLoader();
  const textureBW = loader.load(
    '/demo/assets/textures/uv-test-bw.png',
  );
  const textureCol = loader.load(
    '/demo/assets/textures/uv-test-col.png',
  );

  const red = new THREE.MeshStandardMaterial({ color: 'orangered' });
  const green = new THREE.MeshStandardMaterial({ color: 'seagreen' });
  const blue = new THREE.MeshStandardMaterial({ color: 'lightblue' });
  const uvBW = new THREE.MeshStandardMaterial({ map: textureBW });
  const uvCol = new THREE.MeshStandardMaterial({ map: textureCol });

  const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 1), uvBW);
  // console.log('box: ', new THREE.BoxBufferGeometry(0.2, 0.2, 1));
  box.position.set(0.1, 0.1, 0);

  const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1), red);
  sphere.position.set(0, 0, -0.3);

  const sphereB = sphere.clone();
  sphereB.position.set(0, 0, 0.3);

  const csg = new CSG();
  // csg.union([box, sphere, sphereB]);
  csg.subtract([box, sphere, sphereB]);
  // csg.intersect([box, sphere]);
  console.log('csg: ', csg);

  return {
    testMesh: csg.toMesh(),
  };
}

export { testCSG };
