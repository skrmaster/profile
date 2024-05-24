<script lang="ts" setup>
import PersonalNavigation from './personal-navigation.vue';

const show = ref(false);
function toggleMenu() {
  show.value = !show.value;
}
</script>
<template>
  <div>
    <div class="trigger__navgation">
      <div class="p1 flex__row">
        <div :class="['menu-button', { 'open': show }]" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <Transition name="left-to-right">
      <div v-if="show" class="aside">
        <com-model
          model-close
          v-model="show"
        >
          <personal-navigation 
            :avatar-block="false" 
            class="aside__setting"
            :height="'100vh'"
          ></personal-navigation>
        </com-model>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.trigger__navgation {
  background-color: var(--white-color);
  z-index: 1000;
}
.menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  cursor: pointer;
}

.menu-button span {
  display: block;
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background-color: var(--primary-color);
  transition: transform 0.3s, opacity 0.3s;
}

.menu-button.open span:nth-child(1) {
  transform-origin: center center;
  transform: translateY(10px) rotate(45deg);
}

.menu-button.open span:nth-child(2) {
  opacity: 0;
}

.menu-button.open span:nth-child(3) {
  transform-origin: center center;
  transform: translateY(-10px) rotate(-45deg);
}

.aside {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  max-width: 375px;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
}

.aside__setting {
  max-width: 250px!important;
}

.left-to-right-enter-active, .left-to-right-leave-active {
  transition: transform 0.5s ease .1s;
}

.left-to-right-enter-from, .left-to-right-leave-to {
  transform: translateX(-100%);
}

.left-to-right-enter-to, .left-to-right-leave-from {
  transform: translateX(0);
}

</style>