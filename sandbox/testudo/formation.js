import * as THREE from "three";
import { GLTFLoader } from "./vendor/GLTFLoader.js";
import { clone as cloneSkinned } from "./vendor/SkeletonUtils.js";

const FORMATION_WIDTH = 6;
const FORMATION_DEPTH = 6;
const COLUMN_SPACING = 0.84;
const ROW_SPACING = 0.92;
const SOLDIER_SCALE = 1.18;

const loader = new GLTFLoader();
const materialRegistry = {
  all: [],
  soldiers: [],
  gear: [],
};

export async function createTestudoFormation() {
  const [soldierAsset, helmetAsset, shieldAsset, pilumAsset] = await Promise.all([
    loadAsset("./assets/soldier.glb"),
    loadAsset("./assets/helmet.glb"),
    loadAsset("./assets/scutum.glb"),
    loadAsset("./assets/pilum.glb"),
  ]);

  const root = new THREE.Group();
  root.name = "RomanTestudoFormation";

  const soldiersGroup = new THREE.Group();
  soldiersGroup.name = "Soldiers";
  root.add(soldiersGroup);

  const gearGroup = new THREE.Group();
  gearGroup.name = "Gear";
  root.add(gearGroup);

  const gridGroup = createFormationGrid();
  gridGroup.visible = false;
  root.add(gridGroup);

  const shieldCollection = createInstancedCollection(shieldAsset.scene, FORMATION_WIDTH * FORMATION_DEPTH);
  const helmetCollection = createInstancedCollection(helmetAsset.scene, FORMATION_WIDTH * FORMATION_DEPTH);
  const pilumCollection = createInstancedCollection(pilumAsset.scene, 8);

  for (const mesh of shieldCollection.meshes) {
    gearGroup.add(mesh);
  }
  for (const mesh of helmetCollection.meshes) {
    gearGroup.add(mesh);
  }
  for (const mesh of pilumCollection.meshes) {
    gearGroup.add(mesh);
  }

  const soldierEntries = [];
  const shieldMatrices = [];
  const helmetMatrices = [];
  const pilumMatrices = [];

  let index = 0;
  for (let row = 0; row < FORMATION_DEPTH; row += 1) {
    for (let column = 0; column < FORMATION_WIDTH; column += 1) {
      const role = getRole(row, column);
      const soldier = buildSoldier(cloneSkinned(soldierAsset.scene), role, index, row, column);
      soldier.root.position.set(
        (column - (FORMATION_WIDTH - 1) * 0.5) * COLUMN_SPACING,
        0,
        (row - (FORMATION_DEPTH - 1) * 0.5) * ROW_SPACING,
      );
      soldier.root.rotation.y = getFacingRotation(role);
      soldier.root.position.x += seededCentered(index * 7.1) * 0.03;
      soldier.root.position.z += seededCentered(index * 9.7) * 0.025;
      soldier.root.updateMatrixWorld(true);
      soldiersGroup.add(soldier.root);
      soldierEntries.push(soldier);
      shieldMatrices.push(soldier.shieldSocket.matrixWorld.clone());
      helmetMatrices.push(soldier.helmetSocket.matrixWorld.clone());
      if (soldier.pilumSocket) {
        pilumMatrices.push(soldier.pilumSocket.matrixWorld.clone());
      }
      index += 1;
    }
  }

  applyInstancedMatrices(shieldCollection, shieldMatrices);
  applyInstancedMatrices(helmetCollection, helmetMatrices);
  applyInstancedMatrices(pilumCollection, pilumMatrices);

  const state = {
    showGrid: false,
    showSoldiers: true,
    shieldsOnly: false,
    viewMode: "solid",
  };

  applyDisplayState();
  applyViewMode("solid");

  function applyDisplayState() {
    gridGroup.visible = state.showGrid;
    for (const soldier of soldierEntries) {
      const visible = state.showSoldiers && !state.shieldsOnly;
      soldier.root.visible = visible;
      for (const part of soldier.uniformMeshes) {
        part.visible = visible;
      }
    }

    setCollectionVisible(shieldCollection, true);
    setCollectionVisible(helmetCollection, !state.shieldsOnly);
    setCollectionVisible(pilumCollection, !state.shieldsOnly);
  }

  function applyViewMode(mode) {
    state.viewMode = mode;

    for (const material of materialRegistry.all) {
      material.wireframe = mode === "wireframe";
    }

    for (const material of materialRegistry.soldiers) {
      material.transparent = mode === "xray";
      material.opacity = mode === "xray" ? 0.18 : 1;
      material.depthWrite = mode !== "xray";
      material.side = mode === "xray" ? THREE.DoubleSide : THREE.FrontSide;
    }

    for (const material of materialRegistry.gear) {
      material.transparent = false;
      material.opacity = 1;
      material.depthWrite = true;
      material.side = THREE.FrontSide;
    }
  }

  return {
    root,
    setViewMode(mode) {
      applyViewMode(mode);
    },
    setDisplayState(nextState) {
      Object.assign(state, nextState);
      applyDisplayState();
    },
  };
}

function loadAsset(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function getRole(row, column) {
  if (row === 0) {
    return "front";
  }
  if (row === FORMATION_DEPTH - 1) {
    return "rear";
  }
  if (column === 0) {
    return "side-left";
  }
  if (column === FORMATION_WIDTH - 1) {
    return "side-right";
  }
  return "roof";
}

function getFacingRotation(role) {
  switch (role) {
    case "side-left":
      return -Math.PI * 0.5;
    case "side-right":
      return Math.PI * 0.5;
    case "rear":
      return 0;
    case "front":
    case "roof":
    default:
      return Math.PI;
  }
}

function buildSoldier(baseScene, role, index, row, column) {
  const root = new THREE.Group();
  root.name = `Soldier-${index + 1}`;
  root.add(baseScene);
  baseScene.scale.setScalar(SOLDIER_SCALE);

  const bodyTone = new THREE.Color(0xb39f88).offsetHSL(
    seededCentered(index * 3.4) * 0.015,
    seededCentered(index * 4.1) * 0.03,
    seededCentered(index * 5.3) * 0.02,
  );

  baseScene.traverse((object) => {
    if (object.name === "vanguard_visor") {
      object.visible = false;
      return;
    }
    if (!object.isSkinnedMesh) {
      return;
    }
    const material = new THREE.MeshStandardMaterial({
      color: bodyTone,
      roughness: 0.9,
      metalness: 0.02,
    });
    material.skinning = true;
    registerMaterial(material, "soldiers");
    object.material = material;
    object.castShadow = true;
    object.receiveShadow = true;
    object.frustumCulled = false;
  });

  const uniform = createUniform(index);
  root.add(uniform.group);

  const sockets = createSockets(role, index, row, column);
  root.add(sockets.helmetSocket, sockets.shieldSocket);
  if (sockets.pilumSocket) {
    root.add(sockets.pilumSocket);
  }

  poseSoldier(baseScene, root, role, index);
  root.updateMatrixWorld(true);

  return {
    helmetSocket: sockets.helmetSocket,
    pilumSocket: sockets.pilumSocket,
    root,
    shieldSocket: sockets.shieldSocket,
    uniformMeshes: uniform.meshes,
  };
}

function createUniform(index) {
  const group = new THREE.Group();
  const meshes = [];

  const tunicMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x7e2418).offsetHSL(0, 0, seededCentered(index * 11.2) * 0.05),
      roughness: 0.88,
      metalness: 0.02,
    }),
    "soldiers",
  );
  const leatherMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x603e28,
      roughness: 0.9,
      metalness: 0.02,
    }),
    "soldiers",
  );
  const bronzeMaterial = registerMaterial(
    new THREE.MeshStandardMaterial({
      color: 0x8f7851,
      roughness: 0.46,
      metalness: 0.78,
    }),
    "soldiers",
  );

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.205, 0.5, 18, 1, true), tunicMaterial);
  chest.position.y = 0.83;
  chest.castShadow = true;
  chest.receiveShadow = true;
  group.add(chest);
  meshes.push(chest);

  const armor = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.24, 16, 1, true), bronzeMaterial);
  armor.rotation.z = Math.PI * 0.5;
  armor.scale.set(0.62, 0.62, 0.85);
  armor.position.set(0, 0.9, 0.05);
  armor.castShadow = true;
  armor.receiveShadow = true;
  group.add(armor);
  meshes.push(armor);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 8, 24), leatherMaterial);
  belt.rotation.x = Math.PI * 0.5;
  belt.position.y = 0.71;
  belt.castShadow = true;
  belt.receiveShadow = true;
  group.add(belt);
  meshes.push(belt);

  for (const side of [-1, 1]) {
    const shoulderGuard = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.09, 4, 8), bronzeMaterial);
    shoulderGuard.position.set(side * 0.18, 0.97, 0.03);
    shoulderGuard.rotation.z = side * Math.PI * 0.38;
    shoulderGuard.rotation.x = Math.PI * 0.5;
    shoulderGuard.castShadow = true;
    shoulderGuard.receiveShadow = true;
    group.add(shoulderGuard);
    meshes.push(shoulderGuard);
  }

  for (let panel = 0; panel < 5; panel += 1) {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.2, 0.018), leatherMaterial);
    const normalized = panel / 4 - 0.5;
    skirt.position.set(normalized * 0.145, 0.54, 0.13 - Math.abs(normalized) * 0.05);
    skirt.rotation.x = -0.1;
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    group.add(skirt);
    meshes.push(skirt);
  }

  for (const side of [-1, 1]) {
    const greave = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.24, 4, 8), bronzeMaterial);
    greave.position.set(side * 0.07, 0.18, 0.03);
    greave.rotation.z = Math.PI * 0.5;
    greave.castShadow = true;
    greave.receiveShadow = true;
    group.add(greave);
    meshes.push(greave);
  }

  return { group, meshes };
}

function createSockets(role, index, row, column) {
  const helmetSocket = new THREE.Object3D();
  helmetSocket.position.set(0, 1.28, 0.015);
  helmetSocket.rotation.y = seededCentered(index * 2.4) * 0.08;
  helmetSocket.scale.setScalar(0.88);

  const shieldSocket = new THREE.Object3D();
  shieldSocket.scale.setScalar(1);

  if (role === "front") {
    shieldSocket.position.set(0, 0.92, 0.46);
    shieldSocket.rotation.set(0.06, seededCentered(index) * 0.04, 0);
  } else if (role === "roof") {
    const overlapDrift = (column - 2.5) * 0.045;
    shieldSocket.position.set(overlapDrift, 1.3 - row * 0.01, 0.04);
    shieldSocket.rotation.set(-Math.PI * 0.5 + 0.08, 0, seededCentered(index * 6.2) * 0.06);
  } else if (role === "side-left" || role === "side-right") {
    const sideTilt = role === "side-left" ? 0.22 : -0.22;
    shieldSocket.position.set(0, 0.94, 0.43);
    shieldSocket.rotation.set(0.1, 0, sideTilt);
  } else {
    shieldSocket.position.set(0, 0.94, 0.4);
    shieldSocket.rotation.set(-0.15, 0, 0);
  }

  let pilumSocket = null;
  const shouldCarryPilum =
    role === "rear" ? column % 2 === 1 : (role === "side-left" || role === "side-right") && row % 2 === 0;
  if (shouldCarryPilum) {
    pilumSocket = new THREE.Object3D();
    pilumSocket.position.set(role === "side-left" ? -0.22 : 0.22, 0.92, -0.04);
    pilumSocket.rotation.set(0.16, 0.08, Math.PI * 0.52 * (role === "side-left" ? -1 : 1));
    pilumSocket.scale.setScalar(0.82);
  }

  return { helmetSocket, pilumSocket, shieldSocket };
}

function poseSoldier(baseScene, root, role, index) {
  const torso1 = getBone(baseScene, ["torso_joint_1", "Skeleton_torso_joint_1", "mixamorig:Spine"]);
  const torso2 = getBone(baseScene, ["torso_joint_2", "Skeleton_torso_joint_2", "mixamorig:Spine1"]);
  const torso3 = getBone(baseScene, ["torso_joint_3", "mixamorig:Spine2"]);
  const neck1 = getBone(baseScene, ["neck_joint_1", "Skeleton_neck_joint_1", "mixamorig:Neck"]);
  const legL1 = getBone(baseScene, ["leg_joint_L_1", "mixamorig:LeftUpLeg"]);
  const legR1 = getBone(baseScene, ["leg_joint_R_1", "mixamorig:RightUpLeg"]);
  const legL2 = getBone(baseScene, ["leg_joint_L_2", "mixamorig:LeftLeg"]);
  const legR2 = getBone(baseScene, ["leg_joint_R_2", "mixamorig:RightLeg"]);
  const armL1 = getBone(baseScene, ["arm_joint_L_1", "Skeleton_arm_joint_L__4_", "mixamorig:LeftArm"]);
  const armR1 = getBone(baseScene, ["arm_joint_R_1", "Skeleton_arm_joint_R", "mixamorig:RightArm"]);
  const armL2 = getBone(baseScene, ["arm_joint_L_2", "Skeleton_arm_joint_L__3_", "mixamorig:LeftForeArm"]);
  const armR2 = getBone(baseScene, ["arm_joint_R_2", "Skeleton_arm_joint_R__2_", "mixamorig:RightForeArm"]);

  const jitter = seededCentered(index * 12.3);
  const isMixamo = Boolean(getBone(baseScene, ["mixamorig:Spine"]));

  if (isMixamo) {
    addRotation(armL1, 0.08, 0, -1.08);
    addRotation(armR1, 0.08, 0, 1.08);
    addRotation(armL2, 0.22, 0, 0.08);
    addRotation(armR2, 0.22, 0, -0.08);
  }

  if (role === "front") {
    root.position.y = 0.02;
    addRotation(torso1, 0.18 + jitter * 0.04, 0, 0);
    addRotation(torso2, 0.08, 0, 0);
    addRotation(armL1, 0, 0, isMixamo ? 0.24 : 0.12);
    addRotation(armR1, 0, 0, isMixamo ? -0.24 : -0.12);
  } else if (role === "roof") {
    const crouch = seeded01(index * 7.9) > 0.36;
    root.position.y = crouch ? -0.12 : -0.05;
    addRotation(torso1, 0.46, 0, 0);
    addRotation(torso2, 0.18, 0, 0);
    addRotation(torso3, 0.06, 0, 0);
    addRotation(neck1, -0.18, 0, 0);
    if (crouch) {
      addRotation(legL1, -0.34, 0, 0);
      addRotation(legR1, -0.34, 0, 0);
      addRotation(legL2, 0.58, 0, 0);
      addRotation(legR2, 0.58, 0, 0);
    }
    addRotation(armL1, isMixamo ? 0.16 : 0, 0, isMixamo ? 0.38 : 0.24);
    addRotation(armR1, isMixamo ? 0.16 : 0, 0, isMixamo ? -0.38 : -0.24);
  } else if (role === "side-left" || role === "side-right") {
    const sideSign = role === "side-left" ? -1 : 1;
    root.position.y = -0.03;
    addRotation(torso1, 0.24, 0, sideSign * 0.07);
    addRotation(torso2, 0, 0, sideSign * 0.08);
    addRotation(legL1, -0.1, 0, 0);
    addRotation(legR1, -0.1, 0, 0);
    addRotation(armL1, 0.04, 0, isMixamo ? 0.12 : 0);
    addRotation(armR1, 0.04, 0, isMixamo ? -0.12 : 0);
  } else if (role === "rear") {
    root.position.y = -0.04;
    addRotation(torso1, 0.22, 0, 0);
    addRotation(torso2, 0.1, 0, 0);
    addRotation(neck1, -0.08, 0, 0);
    addRotation(legL1, -0.12, 0, 0);
    addRotation(legR1, -0.12, 0, 0);
  }
}

function createInstancedCollection(assetRoot, maxCount) {
  const meshes = [];
  assetRoot.traverse((object) => {
    if (!object.isMesh) {
      return;
    }
    const material = Array.isArray(object.material) ? object.material[0].clone() : object.material.clone();
    registerMaterial(material, "gear");
    const instanced = new THREE.InstancedMesh(object.geometry.clone(), material, maxCount);
    instanced.castShadow = true;
    instanced.receiveShadow = true;
    instanced.frustumCulled = false;
    meshes.push(instanced);
  });
  return {
    maxCount,
    meshes,
  };
}

function applyInstancedMatrices(collection, matrices) {
  for (const mesh of collection.meshes) {
    mesh.count = matrices.length;
    for (let index = 0; index < matrices.length; index += 1) {
      mesh.setMatrixAt(index, matrices[index]);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
}

function setCollectionVisible(collection, visible) {
  for (const mesh of collection.meshes) {
    mesh.visible = visible;
  }
}

function createFormationGrid() {
  const points = [];
  const halfWidth = ((FORMATION_WIDTH - 1) * COLUMN_SPACING) * 0.5;
  const halfDepth = ((FORMATION_DEPTH - 1) * ROW_SPACING) * 0.5;

  for (let row = 0; row <= FORMATION_DEPTH; row += 1) {
    const z = row * ROW_SPACING - halfDepth - ROW_SPACING * 0.5;
    points.push(new THREE.Vector3(-halfWidth - COLUMN_SPACING * 0.5, 0.02, z));
    points.push(new THREE.Vector3(halfWidth + COLUMN_SPACING * 0.5, 0.02, z));
  }

  for (let column = 0; column <= FORMATION_WIDTH; column += 1) {
    const x = column * COLUMN_SPACING - halfWidth - COLUMN_SPACING * 0.5;
    points.push(new THREE.Vector3(x, 0.02, -halfDepth - ROW_SPACING * 0.5));
    points.push(new THREE.Vector3(x, 0.02, halfDepth + ROW_SPACING * 0.5));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0x486167,
      transparent: true,
      opacity: 0.45,
    }),
  );
  return lines;
}

function registerMaterial(material, bucket) {
  materialRegistry.all.push(material);
  materialRegistry[bucket].push(material);
  return material;
}

function getBone(root, aliases) {
  for (const alias of aliases) {
    const bone = root.getObjectByName(alias);
    if (bone) {
      return bone;
    }
  }
  return null;
}

function addRotation(bone, x = 0, y = 0, z = 0) {
  if (!bone) {
    return;
  }
  bone.rotation.x += x;
  bone.rotation.y += y;
  bone.rotation.z += z;
}

function seeded01(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
}

function seededCentered(seed) {
  return seeded01(seed) * 2 - 1;
}
