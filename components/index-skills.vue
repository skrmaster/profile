<script lang="ts" setup>
type Skill = {
  name: string;
  mastery: number;
  x: number;
  y: number;
  moveVector: number;
  originX: number;
  originY: number;
  class: string;
  id: string;
}

const skillBox = ref<HTMLElement>();
const skillCircle = ref<HTMLElement>();
const skillsName = ['Javascript', 'Echarts', 'HTML', 'Vue2/3', '兼容适配', 'Photoshop', 'Websocket', 'CSS', 'Nuxtjs', 'Sass/Less', 'Uni-app', 'Typescript', 'Canvas', 'Illustrator', 'Git'];
let widthGap: number, heightGap: number;
const skills = ref<Array<Skill>>([]);

function active($event: MouseEvent) {
  const mouseX = $event.offsetX;
  const mouseY = $event.offsetY;
  
  skills.value = skills.value.map(e => {
    const dx = mouseX - e.x;
    const dy = mouseY - e.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const moveX = e.moveVector * dx / distance;
    const moveY = e.moveVector * dy / distance;
    
    e.x = e.originX + moveX;
    e.y = e.originY + moveY;

    return e;
  })  
}

function inactive() {
  skills.value = skills.value.map(e => {
    e.x = e.originX;
    e.y = e.originY;
    return e;
  })
}

onMounted(() => { 
  
  const minWidth = skillCircle.value!.offsetLeft;
  const minHeight = skillCircle.value!.offsetTop;
  const maxWidth = minWidth + 250;
  const maxHeight = minHeight + 250;

  heightGap = skillBox.value!.clientHeight / 5;

  skills.value = skillsName.map((e: string, i: number) => {
    let xCount = 0;
    let yCount = 0;

    if (i <= 2) {
      widthGap = skillBox.value!.offsetWidth / 4;
      xCount = i % 4 === 0 ? 1 : i % 4 + 1;
      yCount = 0;
    } else if (i <= 5) {
      widthGap = skillBox.value!.offsetWidth / 4;
      xCount = i % 3 === 0 ? 1 : i % 3 + 1;
      yCount = 1;
    } else if (i <= 9) {
      widthGap = skillBox.value!.offsetWidth / 5;
      xCount = i % 5 === 0 ? 1 : i % 5;
      yCount = 2;
    } else if (i <= 12) {
      widthGap = skillBox.value!.offsetWidth / 4;
      xCount = i % 4 === 0 ? 1 : i % 4;
      yCount = 3;
    } else if (i <= 14) {
      widthGap = skillBox.value!.offsetWidth / 3;
      xCount = i % 2 === 0 ? 1 : i % 2 + 1;
      yCount = 4;
    }

    return {
      id: useId(),
      name: e,
      mastery: Math.floor(Math.random() * 30) + 20,
      x: xCount * widthGap,
      y: yCount * heightGap,
      moveVector: 20,
      originX: xCount * widthGap,
      originY: yCount * heightGap,
      class: `skills-animate-${Math.floor(Math.random() * 3) + 1} pos-fix`
    }
  });

  nextTick(() => {
    skills.value.forEach(e => {
      const _self = document.getElementById(e.id);

      if (_self) {
        let _selfWidth = _self.offsetWidth;
        let _selfHeight = _self.offsetHeight;

        if (e.x >= minWidth && e.x <= maxWidth && e.y >= minHeight && e.y <= maxHeight) {
          1
        }
      }
    });
  });
});

</script>
<template>
  <div class="container">
    <div 
      ref="skillBox"
      class="skills-box flex__center" 
      @mouseover="active" 
      @mouseout="inactive"
    >
      <div class="skills-text" ref="skillCircle">
        <p class="fs36 font-bold">技能</p>
        <p class="skills-line">
          <span></span>
          <span class="fs36 font-bold mx1">SKILLS</span>
          <span></span>
        </p>
      </div>
      <div 
        v-for="(item, index) in skills" 
        :key="index"
        :id="item.id"
        class="skills__item"
        :class="`fs${item.mastery} ${item.class}`"
        :style="{
          'position': 'absolute',
          'left': `${item.x}px`,
          'top': `${item.y}px`
        }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.skills-box {
  height: 800px;
  padding: 20px;
}

.skills-text {
  width: 250px;
  height: 250px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid var(--primary-border-color);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}

.skills-line {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}

.skills-line span:not(:nth-child(2)) {
  display: inline-block;
  width: 30px;
  height: 1px;
  background-color: var(--primary-color);
}

.skills__item {
  transform-origin: center center;
  transition: all .2s ease-in-out;
}

.pos-fix {
  transform: translateX(-50%);
}

/* 
.skills-animate-1 {
  animation: slowFloatX 2s ease-in-out infinite;
}

.skills-animate-2 {
  animation: slowFloatY 2s ease-in-out infinite;
}

.skills-animate-3 {
  animation: slowFloatXY 2s ease-in-out infinite;
} */
</style>