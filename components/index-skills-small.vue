<script lang="ts" setup> 
type Prop = {
	width?: number;
  skills: Array<Skill.SkillName>;
}

const props = withDefaults(defineProps<Prop>(), {
	width: 0,
  skills: () => []
});

const { skillMgtPath } = routerMap;
const skillBox = ref<HTMLElement>();
const skillCircle = ref<HTMLElement>();
const skills = computed(() => props.skills);

function handleAddSkill() {
  navigateTo(skillMgtPath);
}

</script>
<template>
  <div id="skills" class="container">
    <div class="skills-text" ref="skillCircle">
      <p class="fs36 font-bold">
        <span>技能(SKILLS)</span>
        <com-icon 
          v-if="skills.length === 0"
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
  color: var(--primary-color);
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
  color: var(--primary-color);
}

.skills-line span:not(:nth-child(2)) {
  display: inline-block;
  width: 30px;
  height: 1px;
  background-color: var(--primary-color);
}
</style>