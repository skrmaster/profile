<script lang="tsx" setup>
interface BgSettingProps {
  bgChangeColor?: boolean;
  bgStyleContent?: string;
  bgDefaultSize?: boolean;
}

const props = withDefaults(defineProps<BgSettingProps>(), {
  bgChangeColor: false,
  bgDefaultSize: false,
  bgStyleContent: 'background: #FFFFFF;'
})

const slots = useSlots();

function generateElement() {
  const boolSize = props.bgDefaultSize
  const boolColor = props.bgChangeColor
  const className = {
    'background': !boolColor,
    'default-size': boolSize,
  }
  const style = props.bgStyleContent;

  return (
    <div class={ className } style={ boolColor ? style : '' }>
      { slots && slots.default ? slots.default() : null  }
    </div>
  )
}
</script>
<template>
  <generate-element />
</template>
<style scoped>
.background {
  background-image: radial-gradient(#ffffff 0, var(--background-color) 100%);
  background-blend-mode: screen;
}

.default-size {
  width: 100vw;
  height: 100vh;
}
</style>
