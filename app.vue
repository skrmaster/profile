<script lang="ts" setup>
// onNuxtReady(() => {
//   htmlsize();
//   window.addEventListener('resize', htmlsize);
// })

function htmlsize() {
	const dw = 750;
	let ww = window.innerWidth;
	const maxw = 1920;
	const minw = 320;
	if (window.innerWidth > maxw) { 
    ww = maxw; 
  } else if (window.innerWidth < minw) { 
    ww = minw; 
  }
  const htmlItem = document.getElementsByTagName('html')[0]
  if (htmlItem) {
    htmlItem.style.fontSize = `${Math.floor((ww / dw) * 100)}px`
  }
}
</script>
<template>
  <NuxtPage />
</template>
<style>
@import url('assets/css/index.css');
</style>