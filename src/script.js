import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
let fogColor = "#262837";
let fogNear = 1;
let fogFar = 15;
const fog = new THREE.Fog(fogColor, fogNear, fogFar);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping

grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping

grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * Floor
 */

let floorWidth = 20;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ 
    //   color: "#a9c388" 
    map:grassColorTexture,
    aoMap:grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
        
    })
);
floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * House
 */

// Create "House Group"
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Create "Walls"
let houseWidth = 4;
let houseHeight = 2.5;
let houseDeep = 4;
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(houseWidth, houseHeight, houseDeep),
  new THREE.MeshStandardMaterial({
    // color: "#ac8e82",
    map: bricksColorTexture,
    aoMap:bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  }) // more realistic
);
walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );
walls.position.set(0, houseHeight / 2, 0);
houseGroup.add(walls);

// Create "Roof"
let roofHeight = 1.5;
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  }) // more realistic
);
roof.rotation.y = Math.PI / 4;
roof.position.set(0, houseHeight + roofHeight / 2, 0);
houseGroup.add(roof);

// Create "Door"
let doorHeight = 2.2;
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, doorHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    // color: '#aa7b7b'
    // wireframe:true,
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture, //uv
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap:　doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
// 0.01 => 防止閃逤
door.position.set(0, doorHeight / 2, houseDeep / 2 + 0.01);
houseGroup.add(door);

// Create "Bush"
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.set(0.25, 0.25, 0.25);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.set(0.4, 0.4, 0.4);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.set(0.15, 0.15, 0.15);
houseGroup.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
// Create "Graves Group"
const gravesGroup = new THREE.Group();
scene.add(gravesGroup);

// Create "One Grave"
let graveWidth = 0.6;
let graveHeight = 0.8;
let graveDeep = 0.2;
const graveGeometry = new THREE.BoxBufferGeometry(
  graveWidth,
  graveHeight,
  graveDeep
);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: "#b2b6b1",
});

// 隨機生成 one grave
for (let i = 0; i < 50; i++) {
  // 0~1 + 以房子為中心展開的四周
  // Random angle
  const angle = Math.random() * Math.PI * 2;
  // Random radius
  const radius = houseWidth / 2 + 1 + Math.random() * 6;

  // Get the x position using cosinus
  const x = Math.sin(angle) * radius;
  // Get the z position using sinus
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;
  grave.position.set(x, graveHeight / 2 - 0.05, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  gravesGroup.add(grave);
}

// Temporary sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
sphere.position.y = 1;
scene.add(sphere);

/**
 * Lights
 */
// Ambient light
const lightColor = "#b9d5ff";
const lightWeight = 0.12;
const ambientLight = new THREE.AmbientLight(lightColor, lightWeight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight(lightColor, lightWeight);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light
const doorLightColor = "#ff7d46";
const doorLightIntensity = 1;
const doorLightDistance = 7;
const doorLight = new THREE.PointLight(
  doorLightColor,
  doorLightIntensity,
  doorLightDistance
);
doorLight.position.set(0, 2.2, 2.7);
houseGroup.add(doorLight);

/**
 * Ghost
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight("#00ffff", 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight("#ffff00", 2, 3)
scene.add(ghost3)



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  render.setClearColor(fogColor);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shader
 */
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true


moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15


doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

    //update ghost
    const ghostAngle = elapsedTime*0.5
    ghost1.position.set(
        Math.cos(ghostAngle)*4,
        Math.sin(elapsedTime)*3.2,
        Math.sin(ghostAngle)*4,
    )
    const ghost2Angle = elapsedTime*0.32
    ghost2.position.set(
        Math.cos(ghost2Angle)*5,
        Math.sin(elapsedTime)*4+Math.sin(elapsedTime)*2.5,
        Math.sin(ghost2Angle)*5,
    )
    const ghost3Angle = elapsedTime*0.18
    ghost3.position.set(
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)),
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5)),
    )

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
