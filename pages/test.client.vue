<script lang="ts" setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const isPhone = isMobile();
const threeref = ref<HTMLDivElement | null>(null);

const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/models/Xbot.glb');

let clock: THREE.Clock, mixer: THREE.AnimationMixer;

function init() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 白色光，强度为1
  scene.add(ambientLight);

  // 创建一个点光源 (PointLight)，模拟灯泡等发光物体
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // 亮度为1，范围为100
  pointLight.position.set(10, 10, 10);  // 设置点光源的位置
  scene.add(pointLight);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  threeref.value?.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器属性
  controls.enableDamping = true; // 启用阻尼效果，使旋转更加平滑
  controls.dampingFactor = 0.1; // 阻尼系数
  controls.rotateSpeed = 0.5; // 旋转速度
  controls.zoomSpeed = 1.2; // 缩放速度
  controls.enableZoom = false;
  controls.enablePan = false;

  let model = gltf.scene;
  scene.background = new THREE.Color(0xa0a0a0);
  // model.position.x = -5;
  // model.rotateY(1);
  console.log(model);


  scene.add(model);
  camera.position.z = 5;

  model.traverse(function (object) {
    if ((object as any).isMesh) object.castShadow = true;
  });

  const skeleton = new THREE.SkeletonHelper(model);
  skeleton.visible = false;
  scene.add(skeleton);

  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(model);

  let numAnimations = animations.length;
  console.log(animations);
  for (let i = 0; i !== numAnimations; ++i) {
    let clip = animations[i];
    const name = clip.name;

    const action = mixer.clipAction(clip);

    if (name === 'walk') {
      console.log(name, action);
      // action.play();
    }
    renderer.setAnimationLoop(animate);
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function animate() {

    const mixerUpdateDelta = clock.getDelta();
    mixer.update(mixerUpdateDelta)
    // model.position.x += 0.006;
    // if (model.position.x > 5) {
    //   model.position.x = -5
    // }

    onWindowResize();

    renderer.render(scene, camera);
  }
  animate();
}

onNuxtReady(() => {
  if (!threeref.value) return;
  clock = new THREE.Clock();
  init();
})
</script>

<template>
  <div ref="threeref" class="flex__center"></div>
</template>

<style scoped></style>
