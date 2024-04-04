<script setup lang="ts">
function dragstart(e: DragEvent) {
  e.dataTransfer?.setData('text', (e.target as HTMLElement).id)
}

function drop(e: DragEvent) {
  e.preventDefault();
  const datas = e.dataTransfer?.getData('text')
  const dragNode = document.getElementById(datas || '')
  const parentNode = document.getElementById('drag-container')
  const item = e.target as HTMLElement
  if (dragNode) {
    if (item?.compareDocumentPosition(dragNode) === 2) {
      parentNode?.insertBefore(dragNode, item.nextSibling)
    } else {
      parentNode?.insertBefore(dragNode, item)
    }
  }
  e.dataTransfer?.clearData()
}

function dragover(e: DragEvent) {
  e.preventDefault();
}
</script>
<template>
  <div style="width: 100%;display: flex;flex-flow: column; justify-content: center;align-items: center;">
    <ul id="drag-container" style="transition: all .2s ease;" @dragover="dragover">
      <li id="li1" draggable="true" @drop="drop" @dragstart="dragstart">1</li>
      <li id="li2" draggable="true" @drop="drop" @dragstart="dragstart">2</li>
      <li id="li3" draggable="true" @drop="drop" @dragstart="dragstart">3</li>
      <li id="li4" draggable="true" @drop="drop" @dragstart="dragstart">4</li>
      <li id="li5" draggable="true" @drop="drop" @dragstart="dragstart">5</li>
    </ul>
  </div>
</template>
<style scoped>
.green {
  width: 200px;
  height: 200px;
  background-color: green;
}

.red {
  width: 200px;
  height: 200px;
  background-color: red;
}

ul {
  list-style-type: none;
}

ul li {
  width: 200px;
  height: 40px;
  border: 1px solid #333333;
  border-radius: 5px;
  font-size: 30px;
  text-align: center;
  margin-bottom: 10px;
}
</style>