<script lang="ts" setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createMaterial(text: string, width = 400, height = 70) {
	// 创建一个Canvas元素
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
			
	// 获取2D绘图上下文
	const drawingContext = canvas.getContext('2d');

	if (isNull(drawingContext)) {
		return;
	}
			
	drawingContext.rotate(180 * Math.PI / 180);
	drawingContext.translate(-width, -height);
	// 设置背景颜色和文字样式
	drawingContext.fillStyle = '#ffffff';
	drawingContext.fillRect(0, 0, width, height);
	drawingContext.fillStyle = '#000000';
	drawingContext.font = 'Bold 30px Arial';

	//绘制文字
	drawingContext.fillText(text, width / 2 - width / 4, height / 2);

	// 创建纹理
	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
	const res = new THREE.MeshStandardMaterial({ map: texture });
			
	return res;
}

//#region 1
const threeRef = ref();

//场景
const scene = new THREE.Scene();
//相机
// const camera = new THREE.PerspectiveCamera(200, window.innerWidth / window.innerHeight, 1, 1000 );
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.z = 500;

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白色光，强度为1
scene.add(ambientLight);

// 添加方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize(); // 设置光源方向
scene.add(directionalLight);

//渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize( window.innerWidth - 50, window.innerHeight );
renderer.setClearColor("#FFFFFF", 0);

const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器属性
controls.enableDamping = true; // 启用阻尼效果，使旋转更加平滑
controls.dampingFactor = 0.1; // 阻尼系数
controls.rotateSpeed = 0.5; // 旋转速度
controls.zoomSpeed = 1.2; // 缩放速度
controls.update();

const loader = new GLTFLoader();
const loadModelOrigin = await loader.loadAsync('/models/signpost.gltf');
const loadModel = loadModelOrigin.scene;

loadModel.traverse((child) => {
	const node = child as THREE.Mesh;
	const material = createMaterial('Hello, World!');

	if (node.isMesh) {
    if (node.name !== '路牌主轴') {
      node.material = material as THREE.Material;
    } else {
      node.material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // 设置颜色为白色
        metalness: 0.1, // 金属度
        roughness: 0.1 // 粗糙度
      });
    }
  }
});
scene.add(loadModel);

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

onNuxtReady(() => {
	if (threeRef.value) {
		threeRef.value.appendChild(renderer.domElement);
		animate();
	}
});
//#endregion
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