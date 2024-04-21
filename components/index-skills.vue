<script lang="ts" setup>

const skills = ref([
  {
    name: 'vuejs',
    mastery: 38,
    x: 20,
    y: 20,
    moveVector: 20
  }
]);

async function active($event: MouseEvent) {
  const mouseX = $event.offsetX;
  const mouseY = $event.offsetY;
  
  skills.value = skills.value.map(e => {
    let newX, newY;
    if (e.x <= mouseX && e.y <= mouseY) {
      newX = mouseX * Math.sqrt(mouseX ** 2 + mouseY ** 2) /
        Math.sqrt(e.x ** 2 + e.y ** 2) + e.moveVector;
      newY = mouseY * Math.sqrt(mouseX ** 2 + mouseY ** 2) /
        Math.sqrt(e.x ** 2 + e.y ** 2) + e.moveVector;
    } else if (e.x <= mouseX && e.y > mouseY) {
      const m = mouseY - e.y / mouseX - e.x;
      const b = e.y - m * e.x;
      const bX = -b / m;
      const bY = b;
    } else if (e.x > mouseX && e.y <= mouseY) {
      1
    } else {
      newX = mouseX * Math.sqrt(mouseX ** 2 + mouseY ** 2) /
        Math.sqrt(e.x ** 2 + e.y ** 2) - e.moveVector;
      newY = mouseY * Math.sqrt(mouseX ** 2 + mouseY ** 2) /
        Math.sqrt(e.x ** 2 + e.y ** 2) - e.moveVector;
    }

    return e;
  })
}

</script>
<template>
  <div class="container">
    <div class="skills-box flex__center" @mouseover="active">
      <div class="skills-text">
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
        class="skills-animate"
        :class="`fs${item.mastery}`"
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

.skills-animate {
  transition: all .2s ease-in-out;
  /* animation: slowFloat 2s ease-in-out infinite; */
}
</style>