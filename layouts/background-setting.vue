<script lang="tsx" setup>
import { useSlots, useAttrs } from 'vue'

const props = withDefaults(defineProps<{
  config: {
    backgroundChangeColor?: boolean;
    backgroundChangeColorContent?: string;
    backgroundDefaultSize?: boolean;
  }
}>(), {
  config: () => {
    return {
      backgroundChangeColor: true,
      backgroundDefaultSize: false,
      backgroundChangeColorContent: 'background: #FFFFFF;'
    }
  }
})
const slots = useSlots();

function generateElement() {
  const boolSize = props.config.backgroundDefaultSize
  const boolColor = props.config.backgroundChangeColor
  const className = {
    'background': boolColor,
    'default-size': boolSize
  }
  const style = props.config.backgroundChangeColorContent

  return <div class={ className } style={ boolColor ? style : '' }>{ slots.default() }</div>
}

</script>
<template>
  <generateElement />
</template>
<style scoped>
.background {
  background-image: radial-gradient(#ffffff 0, #eef1f5 100%);
  background-blend-mode: screen;
}

.default-size {
  width: 100vw;
  height: 100vh;
}
</style>
