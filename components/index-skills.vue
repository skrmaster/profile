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

const { skillMgtPath } = routerMap;
const skillBox = ref<HTMLElement>();
const skillCircle = ref<HTMLElement>();
const skillsName: string[] = [];
['Javascript', 'Echarts', 'HTML', 'Vue2/3', '兼容适配', 'Photoshop', 'Websocket', 'CSS', 'Nuxtjs', 'Sass/Less', 'Uni-app', 'Typescript', 'Canvas', 'Illustrator', 'Git'];
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

function handleAddSkill() {
  navigateTo(skillMgtPath);
}

onMounted(() => {
  let minWidth = skillCircle.value!.offsetLeft;
  let minHeight = skillCircle.value!.offsetTop;
  let maxWidth = minWidth + 250;
  let maxHeight = minHeight + 250;

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
      class: `skills-animate-${Math.floor(Math.random() * 3) + 1}`
    }
  });

  nextTick(() => {
    const gap = 30;
    minWidth -= gap;
    maxWidth += gap;
    minHeight -= gap;
    maxHeight += gap;
    skills.value.forEach(e => {
      const _self = document.getElementById(e.id);

      if (_self) {
        let _selfWidth = _self.offsetWidth;
        let _selfHeight = _self.offsetHeight;
        const _selfHalfWidth = _selfWidth / 2;
        const _selfHalfHeight = _selfHeight / 2;

        if (
          e.x + _selfWidth >= minWidth
          && e.x <= maxWidth
          && e.y + _selfHeight >= minHeight
          && e.y <= maxHeight
        ) {
          
          if (e.x + _selfWidth - minWidth < e.y + _selfHeight - minHeight) {
            if ((e.x + _selfWidth - minWidth) <= (maxWidth - minWidth) / 2) {
              e.x = e.x - (e.x + _selfWidth - minWidth);
              e.originX = e.x;
            } else {
              e.x = e.x + (maxWidth - e.x);
              e.originX = e.x;
            }
          } else {
            if ((e.y + _selfHeight - minHeight) <= (maxHeight - minHeight) / 2) {
              e.y = e.y - (e.y + _selfHeight - minHeight);
              e.originY = e.y;
            } else {
              e.y = e.y + (maxHeight - e.y);
              e.originY = e.y;
            }
          }
        } else {
          e.x -= _selfHalfWidth;
          e.originX = e.x;
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
      <div 
        class="skills-text"
        ref="skillCircle" 
        :class="{
          show__add: skillsName.length === 0
        }"
      >
        <p class="fs36 font-bold">技能</p>
        <p class="skills-line">
          <span></span>
          <span class="fs36 font-bold mx1">SKILLS</span>
          <span></span>
        </p>
        <div class="add__skill">
          <div class="flex__center wh100" @click="handleAddSkill">
            <com-icon icon="profile-close" style="transform: rotate(45deg);"></com-icon>
            <span class="ml1">添加新技能</span>
          </div>
        </div>
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
  overflow: hidden;
  position: relative;
  max-width: 250px;
  min-width: 100px;
  width: 100%;
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

.none-transform {
  transform: none;
}

.skills-animate-1 {
  animation: slowFloatX 2s ease-in-out infinite;
}

.skills-animate-2 {
  animation: slowFloatY 2s ease-in-out infinite;
}

.skills-animate-3 {
  animation: slowFloatXY 2s ease-in-out infinite;
}

.show__add:hover .add__skill {
  opacity: 1;
  transform: translateY(0);
  cursor: pointer;
}

.show__add .add__skill {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 50%;
  background-color: var(--white-color);
  top: 0;
  transform: translateY(-100%);
  transition: all .1s ease;
}
</style>