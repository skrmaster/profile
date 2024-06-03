<script lang="ts" setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const threeRef = ref();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000 );

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白色光，强度为1
scene.add(ambientLight);

// 添加方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize(); // 设置光源方向
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor("#FFFFFF", 0);

const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器属性
controls.enableDamping = true; // 启用阻尼效果，使旋转更加平滑
controls.dampingFactor = 0.1; // 阻尼系数
controls.rotateSpeed = 0.5; // 旋转速度
controls.zoomSpeed = 1.2; // 缩放速度

const loader = new GLTFLoader();
loader.load( '/models/signpost.gltf', function ( gltf: { scene: THREE.Object3D<THREE.Object3DEventMap>; } ) {
	gltf.scene.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 设置颜色为白色
        metalness: 0.1, // 金属度
        roughness: 0.1 // 粗糙度
      });
    }
	});

	const model =	gltf.scene;
	model.rotation.y = THREE.MathUtils.degToRad(270);
	model.rotation.z = THREE.MathUtils.degToRad(-25);
	model.scale.set(1.8, 1.8, 1.8);
	model.position.set(0, -5, -15);
  scene.add(model);
}, undefined, function (error: any) {
	console.error( error );
});

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

// watch(threeRef, (val) => {
// 	if (val) {
// 		threeRef.value.appendChild( renderer.domElement );
// 		animate();
// 	}
// });

onNuxtReady(() => {
	if (threeRef.value) {
		threeRef.value.appendChild( renderer.domElement );
		animate();
	}
});

</script>
<template>
  <div class="border213 flex__center mb2" ref="threeRef">
		
  </div>
</template>
<style scoped>
.border213>canvas {
	outline: 1px solid red;
}
</style>