<script lang="tsx" setup>
import type { JSX } from 'vue/jsx-runtime';

const isGenerate = ref(false)
let elementDiv: null | JSX.Element = null

onNuxtReady(() => {

  elementDiv = generateLineWave()
  isGenerate.value = true
})

function generateLineWave(): JSX.Element {
  const maxWidth = window.innerWidth

  return (
    <svg width={ maxWidth } height={ 1 }>
      <line x1={0} y1={0} x2={0} y2={maxWidth} />
    </svg>
  )
}

</script>
<template>
  <div class="nav-box">

    <div v-if="isGenerate" class="line-wave">
      <elementDiv />
    </div>
  </div>
</template>
<style scoped>
.nav-box {
  height: 81px;
  position: relative;
}

.line-wave {
  width: 100vw;
  position: absolute;
  bottom: 0;
  height: 1px;
}
</style>