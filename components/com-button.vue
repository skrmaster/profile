<script lang="ts" setup>
type Props = {
  prefixIcon?: string;
  suffixIcon?: string;
  type?: string;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  link?: boolean;
  isRipple?: boolean;
  bgColor?: string;
  needInnerOutline?: boolean;
}
const emit = defineEmits<{
  click: [event: Event]
}>();
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  plain: false,
  disabled: false,
  loading: false,
  link: false,
  isRipple: false,
  bgColor: 'var(--primary-color)',
  needInnerOutline: true
});

const rippleRef = ref();
let zIndex = 1;

function ripple(el: HTMLElement, e: MouseEvent) {
  const target: HTMLElement = e.target as HTMLElement;
  const offset = target.getBoundingClientRect();
  let w = target.offsetWidth;
  let h = target.offsetHeight;
  let r = Math.sqrt(w * w + h * h);
  let x = e.clientX - offset.left;
  let y = e.clientY - offset.top;

  let ripples = document.createElement('span');
  ripples.className = 'ripple__item';
  ripples.style.position = 'absolute';
  ripples.style.left = x + 'px';
  ripples.style.top = y + 'px';
  ripples.style.zIndex = `${zIndex++}`;
  el.appendChild(ripples);

  setTimeout(() => {
    ripples.style.width = 2 * r + 'px';
    ripples.style.height = 2 * r + 'px';
    ripples.style.opacity = '0';
  }, 0);

  setTimeout(() => {
    ripples.remove();
  }, 401);
}

function handleClick($event: Event) {
  if (props.isRipple) {
    ripple(rippleRef.value, $event as MouseEvent);
  }
  $event.preventDefault();
  emit('click', $event);
}
</script>
<template>
  <button 
    v-if="!props.link"
    ref="rippleRef"
    :aria-disabled="props.disabled"
    class="btn c-p ripple-button"
    :class="{
      'primary': props.type === 'primary',
      'plain': props.plain,
      'disabled': props.disabled
    }"
    :style="{
      '--btn-box-shadow': `0px 0px 8px 2px rgba(0, 0, 0, 0.2)
      ${ props.needInnerOutline 
        ? ', inset 0px 0px 8px 0px rgba(255, 255, 255, 0.9)' 
        : ';'
      }`,
      backgroundColor: props.bgColor
    }"
    v-bind="$attrs"
    @click="handleClick"
  >
    <com-icon :icon="props.prefixIcon"></com-icon>
    <slot />
    <com-icon :icon="props.suffixIcon"></com-icon>
  </button>
  <button v-else
    type="button"
    :aria-disabled="props.disabled"
    role="link"
    class="btn--link c-p"
    @click="handleClick"
  >
    <com-icon :icon="props.prefixIcon"></com-icon>
    <slot />
    <com-icon :icon="props.suffixIcon"></com-icon>
  </button>
</template>
<style scoped>

.btn{
  border-radius: 50px;
  padding: 8px 15px;
}

.btn.primary {
  box-shadow: var(--btn-box-shadow);
  background-color: var(--primary-color);
  color: var(--white-color);
  border: solid 5px var(--white-color);
}

/* .btn.primary:active {
  box-shadow: none!important;
} */


.btn.plain {
  box-shadow: none;
  background: var(--white-color)!important;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover {
  opacity: 0.9;
}

.btn:not(.disabled, .plain):active {
  opacity: 1;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
}

.btn--link {
  background: transparent;
  height: auto;
}
</style>