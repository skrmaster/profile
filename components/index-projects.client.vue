<script lang="ts" setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { apiGetList } from '~/api/project/request';
import type { ListItem } from '~/api/project/model';

type Prop = {
	width?: number;
}

const props = withDefaults(defineProps<Prop>(), {
	width: 0
});


const isMoveDevice = isMobile();
const { $message } = useNuxtApp();
const { projectDetailPath } = routerMap;
const windowWidth = computed(() => props.width);
watch(windowWidth, (val) => {
	if (val) {
		resizeModel(val);
	}
});
const data = ref<Array<ListItem | undefined>>([]);
const threeRef = ref();

//场景
const scene = new THREE.Scene();

//相机
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.z = 700;

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白色光，强度为1
scene.add(ambientLight);

// 添加方向光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize(); // 设置光源方向
scene.add(directionalLight);

//渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });


if (isMoveDevice) {
	renderer.setSize( window.innerWidth - 100, window.innerHeight );
} else {
	renderer.setSize( window.innerWidth - 50, window.innerHeight );
}

renderer.setClearColor("#FFFFFF", 0);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器属性
controls.enableDamping = true; // 启用阻尼效果，使旋转更加平滑
controls.dampingFactor = 0.1; // 阻尼系数
controls.rotateSpeed = 0.5; // 旋转速度
//controls.zoomSpeed = 1.2; // 缩放速度
controls.enableZoom = false;
controls.enablePan = false;
// controls.update();

const loader = new GLTFLoader();
const loadModelOrigin = await loader.loadAsync('/models/signpost.gltf');
const loadModel = loadModelOrigin.scene;

// 射线投射器
const raycaster = new THREE.Raycaster();
raycaster.far = 1000;
const mouse = new THREE.Vector2();

let index = 0;
let modelLen = 0;
let list = data.value;

function init() {
	loadModel2Sence();
}

const { data: projectData } = await useAsyncData('project', () => apiGetList({ page: 1, pageSize: 6 }));

function initData() {
	list = projectData.value?.data.list || [];
	init();
}

function loadModel2Sence() {
	loadModel.traverse((child) => {
		const node = child as THREE.Mesh;

		if (child.children && child.type.toLocaleLowerCase() === 'group') {
			modelLen = child.children.length;
			let diff = (modelLen > 6 ? 6 : modelLen) - list.length;
			const diffArr: Array<undefined> = Array.from({ length: diff }).fill(undefined) as Array<undefined>;
			list = list.concat(diffArr);
			list = list.reverse();	
		}

		if (node.isMesh) {
			let text: string = '······';
			if (index <= list.length - 1) {
				let e = list[index];

				node.userData.projectId = e?.id;
				text = e?.name || '······';
				index++;
			}
		
    if (node.name !== '路牌1主轴') {
				let material;
				if (node.name.includes('_反')) {
					if (node.name.includes('路牌2_反')) {
						text = '项目展示路牌'
						material = createMaterial(text, 400, 70, 400 / 6);
					} else {
						material = createMaterial(text, 400, 70, 400 / 6);
					}
				} else {
					material = createMaterial(text, 400, 70);
				}
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

	loadModel.position.set(0, -250, 0);
	scene.add(loadModel);

	animate();
}

function createMaterial(text: string, width = 400, height = 70, widthOffset = width / 4, heightOffset = 10) {
	// 创建一个Canvas元素
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
			
	// 获取2D绘图上下文
	const drawingContext = canvas.getContext('2d');

	const textLen = text.length || 0

	if (isNull(drawingContext)) {
		return;
	}
  drawingContext.rotate(180 * Math.PI / 180);
  drawingContext.translate(-width, -height);
	// 设置背景颜色和文字样式
	drawingContext.fillStyle = '#ffffff';
	drawingContext.fillRect(0, 0, width, height);
	drawingContext.fillStyle = '#000000';
	drawingContext.font = textLen >= 8 ? 'Bold 20px Arial' : 'Bold 30px Arial';

	//绘制文字
	drawingContext.fillText(text, textLen >= 10 ? 50 : textLen >= 8 ? 80 : width / 2 - widthOffset, height / 2 + heightOffset);

	// 创建纹理
	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;
	const res = new THREE.MeshStandardMaterial({ map: texture });
			
	return res;
}

function resizeModel(width: number) {
	let rate = window.innerWidth / window.innerHeight;

	camera.aspect = rate;
	camera.updateProjectionMatrix();
	renderer.setSize(width - 50, width / rate);
}

// 监听鼠标点击事件
function onMouseClick(event: MouseEvent) {	
	const rect = renderer.domElement.getBoundingClientRect();

  // 将鼠标点击位置转换为标准化设备坐标 (NDC)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  // 更新射线投射器
  raycaster.setFromCamera(mouse, camera);
  
  // 计算与场景中所有物体的交叉点
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (intersectedObject instanceof THREE.Mesh) {
			
			if (intersectedObject.userData?.projectId) {
				intersectedObject.material.color.set(0x1b1b1b);
				navigateTo({
          path: projectDetailPath + '/view',
          query: {
            id: intersectedObject.userData.projectId
          }
        });
			} else {
				if (!intersectedObject.name.includes('路牌2_反') && !intersectedObject.name.includes('路牌1主轴')) {
					$message.show({
						message: '当前没有项目'
					});
					intersectedObject.material.color.set(0x1b1b1b);
				}
			}
    }
  }
}

function animate() {
	if (isMoveDevice) {
		renderer.setSize( window.innerWidth - 100, window.innerHeight );
	} else {
		renderer.setSize( window.innerWidth - 50, window.innerHeight );
	}
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

onNuxtReady(() => {
	initData();
	if (threeRef.value) {
		threeRef.value.appendChild(renderer.domElement);
		threeRef.value.addEventListener('click', onMouseClick);
	}
});
</script>
<template>
  <div class="flex__center mb2" ref="threeRef"></div>
</template>
<style scoped>
</style>