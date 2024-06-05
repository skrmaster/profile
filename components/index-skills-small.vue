<script lang="ts" setup>
import { apiSkillGetList } from '~/api/skill/request'
 
type Skill = {
  name: string;
  mastery: string;
  x: number;
  y: number;
  moveVector: number;
  originX: number;
  originY: number;
  class: string;
  id: string;
}

type SkillName = {
  name: string;
  proficiency: number;
  id: number;
}

type Prop = {
	width?: number;
}

const props = withDefaults(defineProps<Prop>(), {
	width: 0
});

const windowWidth = computed(() => props.width);
watch(windowWidth, (val) => {
	if (val) {
    1
	}
});

const proficiencyMap: Record<number, string> = {
  100: '38',
  90: '30',
  80: '24',
  70: '18',
}

const { skillMgtPath } = routerMap;
const skillBox = ref<HTMLElement>();
const skillCircle = ref<HTMLElement>();
const skillsName = ref<SkillName[]>([]);
const skills = ref<Array<Skill>>([]);
let elementResize: null | ResizeObserver = null;
  
let widthGap = 0;
let heightGap = 0;
let minWidth = 0;
let minHeight = 0;
let maxWidth = 0;
let maxHeight = 0;

function callback(entries: ResizeObserverEntry[]) {
  for (const entry of entries) {
    const w = entry.contentRect.width;
  }
}

function active($event: MouseEvent) {
  const mouseX = $event.offsetX;
  const mouseY = $event.offsetY;
  
  skills.value = skills.value.map(e => {
    const dx = mouseX - e.x;
    const dy = mouseY - e.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const moveX = e.moveVector * dx / distance;
    const moveY = e.moveVector * dy / distance;
    
    e.x = Math.ceil(e.originX + moveX);
    e.y = Math.ceil(e.originY + moveY);

    return e;
  })  
}

function inactive() {
  skills.value = skills.value.map(e => {
    e.x = e.originX;
    e.y = e.originY;
    return e;
  });
}

function handleAddSkill() {
  navigateTo(skillMgtPath);
}

function fetchData() {
  const params: Omit<Pagination, 'total'> = {
    page: 1,
    pageSize: 15
  }

  apiSkillGetList(params).then(res => {
    skillsName.value = res.data.list.map(e => {
      return {
        name: e.name,
        proficiency: e.proficiency,
        id: e.id
      }
    });
    mountedSkills();
  }).catch(() => {
    skillsName.value = [];
  });
}

function mountedSkills() {
  skills.value = skillsName.value.map((e, i: number) => {
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
      id: `skill-${e.id}`,
      name: e.name,
      mastery: proficiencyMap[e.proficiency],
      x: xCount * widthGap,
      y: yCount * heightGap,
      moveVector: 20,
      originX: xCount * widthGap,
      originY: yCount * heightGap,
      class: `skills-animate-${Math.floor(Math.random() * 3) + 1}`
    }
  });
}

onMounted(() => {
  fetchData();
});
</script>
<template>
  <div class="container">
    <div class="skills-text" ref="skillCircle">
      <p class="fs36 font-bold">
        <span>技能(SKILLS)</span>
        <com-icon 
          v-if="true || skillsName.length === 0"
          class="ml1"
          @click="handleAddSkill"
          icon="profile-add"
        ></com-icon>
      </p>
    </div>
    <div 
      ref="skillBox"
      class="skills-box skills-grid"
    >
      <div 
        v-for="(item, index) in skills" 
        :key="index"
        :id="item.id"
        class="skills__item"
      >
        <div class="flex__center wh100">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.skills-box {
  padding: 20px;
  position: relative;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.skills-text {
  padding: 20px;
}

.skills-line {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}

.skills__item {
  height: 50px;
  box-shadow: var(--box-shadow-small);
}

.skills-line span:not(:nth-child(2)) {
  display: inline-block;
  width: 30px;
  height: 1px;
  background-color: var(--primary-color);
}
</style>