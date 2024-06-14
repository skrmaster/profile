<script lang="ts" setup>
type Prop = {
  content?: string;
  placement?: 'top' | 'left' | 'right' | 'bottom'
}

const props = withDefaults(defineProps<Prop>(), {
  content: '',
  placement: 'top'
});

const placement = toRef(() => props.placement);

</script>
<template>
  <div class="tip__box">
    <slot></slot>
    <div class="tip" 
      :class="placement"
    >
      <div class="p-r arrow" :class="placement">
        {{ props.content }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.tip__box {
  display: inline-block;
  position: relative;
}

.tip__box .tip {
  display: none;
  background-color: var(--model-control-bg-color);
  color: var(--tip-color);
  font-size: 12px;
  border-radius: 4px;
}

.tip__box:hover .tip {
  display: inline-block;
}

.tip.top {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.tip.right {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}

.tip.bottom {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.tip.left {
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
}

.arrow {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
}

.arrow.top::after {
  content: "";
  position: absolute;
  border-width: 6px;
  border-color: var(--model-control-bg-color) transparent transparent transparent;
  border-style: solid;
  bottom: -6px;
  left: 50%;
  transform: translate(-50%, 50%);
}

.arrow.right::after {
  content: "";
  position: absolute;
  border-width: 6px;
  border-color: transparent var(--model-control-bg-color) transparent transparent;
  border-style: solid;
  top: 50%;
  left: -6px;
  transform: translate(-50%, -50%);
}

.arrow.bottom::after {
  content: "";
  position: absolute;
  border-width: 6px;
  border-color: transparent transparent var(--model-control-bg-color) transparent;
  border-style: solid;
  top: -6px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.arrow.left::after {
  content: "";
  position: absolute;
  border-width: 6px;
  border-color: transparent transparent transparent var(--model-control-bg-color);
  border-style: solid;
  top: 50%;
  right: -6px;
  transform: translate(50%, -50%);
}
</style>