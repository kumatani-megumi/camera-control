import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Base camera
let camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 5;

// GLTFLoader
const gltfLoader = new GLTFLoader();
gltfLoader.load("public/gltf/cubeanimation.gltf", (gltf) => {
  console.log(gltf);
  initStage(gltf);
});

// Add stage elements
let animationMixer, animationClip, animationAction;

function initStage(gltf) {
  scene.add(gltf.scene);
  camera = gltf.cameras[0];
  animationMixer = new THREE.AnimationMixer(camera.parent);
  animationClip = gltf.animations[0];
  animationAction = animationMixer.clipAction(animationClip); // animationAction.play();
  animationAction.play();
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  if (animationMixer) {
    animationMixer.update(clock.getDelta);
  }
  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
