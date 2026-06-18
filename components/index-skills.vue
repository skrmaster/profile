<script lang="ts" setup>
import type { UserModel } from "~/api/user/model";
import { apiSkillGetList } from "~/api/skill/request";

type Prop = {
  width?: number;
};

const props = withDefaults(defineProps<Prop>(), {
  width: 0,
});

const windowWidth = computed(() => props.width);
watch(windowWidth, (val) => {
  if (val) {
    1;
  }
});

const proficiencyMap: Record<number, string> = {
  100: "38",
  90: "30",
  80: "24",
  70: "18",
};

const params: Omit<Pagination, "total"> = {
  page: 1,
  pageSize: 15,
};
const skillsData = computed(() => {
  return apiSkillGetList(params);
});

const userInfo = useState<UserModel | undefined>("userInfo");
const isAuth = computed(
  () => userInfo.value?.permission?.includes("1") || false,
);
const skillBox = ref<HTMLElement>();
const skillCircle = ref<HTMLElement>();
const skillsName = computed(() => skillsData.value?.list || []);
const skills = ref<Array<Skill.Skill>>([]);
let elementResize: null | ResizeObserver = null;
let functionId: ReturnType<typeof setTimeout>;
let widthGap = 0;
let heightGap = 0;
let minWidth = 0;
let minHeight = 0;
let maxWidth = 0;
let maxHeight = 0;

function active($event: MouseEvent) {
  const mouseX = $event.offsetX;
  const mouseY = $event.offsetY;

  skills.value = skills.value.map((e) => {
    const dx = mouseX - e.x;
    const dy = mouseY - e.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const moveX = (e.moveVector * dx) / distance;
    const moveY = (e.moveVector * dy) / distance;

    e.x = Math.ceil(e.originX + moveX);
    e.y = Math.ceil(e.originY + moveY);

    e.class = "";

    return e;
  });

  clearTimeout(functionId);
  functionId = setTimeout(() => {
    skills.value.forEach((e, i) => {
      skills.value[i].class = e.originClass;
    });
  }, 1000);
}

function inactive() {
  skills.value = skills.value.map((e) => {
    e.x = e.originX;
    e.y = e.originY;
    return e;
  });
}

function handleAddSkill() {}

const debounceMoutedskills = debounce(mountedSkills, 500);
function mountedSkills() {
  skills.value =
    skillsName.value?.map((e, i: number) => {
      let xCount = 0;
      let yCount = 0;

      if (skillBox.value) {
        if (i <= 2) {
          widthGap = skillBox.value.offsetWidth / 4;
          xCount = i % 4 === 0 ? 1 : (i % 4) + 1;
          yCount = 0;
        } else if (i <= 5) {
          widthGap = skillBox.value!.offsetWidth / 4;
          xCount = i % 3 === 0 ? 1 : (i % 3) + 1;
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
          xCount = i % 2 === 0 ? 1 : (i % 2) + 1;
          yCount = 4;
        }
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
        class: `skills-animate-${Math.floor(Math.random() * 3) + 1}`,
        originClass: `skills-animate-${Math.floor(Math.random() * 3) + 1}`,
      };
    }) || [];

  nextTick(() => {
    const gap = 30;
    minWidth -= gap;
    maxWidth += gap;
    minHeight -= gap;
    maxHeight += gap;
    skills.value.forEach((e) => {
      const _self = document.getElementById(e.id);

      if (_self) {
        let _selfWidth = _self.offsetWidth;
        let _selfHeight = _self.offsetHeight;
        const _selfHalfWidth = _selfWidth / 2;
        const _selfHalfHeight = _selfHeight / 2;

        if (
          e.x + _selfWidth >= minWidth &&
          e.x <= maxWidth &&
          e.y + _selfHeight >= minHeight &&
          e.y <= maxHeight
        ) {
          if (e.x + _selfWidth - minWidth < e.y + _selfHeight - minHeight) {
            if (e.x + _selfWidth - minWidth <= (maxWidth - minWidth) / 2) {
              e.x = e.x - (e.x + _selfWidth - minWidth);
              e.originX = e.x;
            } else {
              e.x = e.x + (maxWidth - e.x);
              e.originX = e.x;
            }
          } else {
            if (e.y + _selfHeight - minHeight <= (maxHeight - minHeight) / 2) {
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
}

onMounted(() => {
  if (!skillBox.value) {
    return;
  }
  elementResize = resize(skillBox.value, (wh) => {
    minWidth = skillCircle.value!.offsetLeft;
    minHeight = skillCircle.value!.offsetTop;
    maxWidth = minWidth + 250;
    maxHeight = minHeight + 250;

    heightGap = skillBox.value!.clientHeight / 5;
    debounceMoutedskills();
  });
});

onBeforeUnmount(() => {
  if (skillBox.value) {
    elementResize?.unobserve(skillBox.value);
  }
});
</script>
<template>
  <div id="skills" class="container">
    <div
      ref="skillBox"
      class="skills-box flex__center"
      @mousemove="active"
      @mouseout="inactive"
    >
      <div
        class="skills-text"
        ref="skillCircle"
        :class="{
          show__add: skillsName.length === 0,
        }"
      >
        <p class="fs36 font-bold">技能</p>
        <p class="skills-line">
          <span></span>
          <span class="fs36 font-bold mx1">SKILLS</span>
          <span></span>
        </p>
        <div v-if="isAuth && skills.length === 0" class="add__skill">
          <div class="flex__center wh100" @click="handleAddSkill">
            <com-icon
              icon="profile-close"
              style="transform: rotate(45deg)"
            ></com-icon>
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
          '--animate-params-': `translate(${item.x}px, ${item.y}px)`,
          transform: `translate(${item.x}px, ${item.y}px)`,
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
  position: relative;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
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
  color: var(--primary-color);
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
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center center;
  transition: all 0.2s ease-in-out;
  color: var(--primary-color);
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
  transition: all 0.1s ease;
}

@keyframes slowFloatX {
  0% {
    transform: var(--animate-params-) translateX(0);
  }
  50% {
    transform: var(--animate-params-) translateX(10px);
  }
  100% {
    transform: var(--animate-params-) translateX(0);
  }
}

@keyframes slowFloatY {
  0% {
    transform: var(--animate-params-) translateY(0);
  }
  50% {
    transform: var(--animate-params-) translateY(10px);
  }
  100% {
    transform: var(--animate-params-) translateY(0);
  }
}

@keyframes slowFloatXY {
  0% {
    transform: var(--animate-params-) translate(0, 0);
  }
  50% {
    transform: var(--animate-params-) translate(10px, 10px);
  }
  100% {
    transform: var(--animate-params-) translate(0, 0);
  }
}
</style>
