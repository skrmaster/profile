<script lang="ts" setup>
type Props = {
  prefixIcon?: string;
  suffixIcon?: string;
  type?: string;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  link?: boolean;
}
const emit = defineEmits<{
  click: [event: Event]
}>();
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  plain: false,
  disabled: false,
  loading: false,
  link: false
});

function handleClick($event: Event) {
  $event.preventDefault();

  emit('click', $event);
}
</script>
<template>
  <button 
    v-if="!props.link"
    :aria-disabled="props.disabled"
    class="btn c-p"
    :class="{
      'primary': props.type === 'primary',
      'plain': props.plain,
      'disabled': props.disabled
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
  width: 100%;
}

.btn.primary {
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2), inset 0px 0px 8px 0px rgba(255, 255, 255, 0.9);
  background: var(--primary-color);
  color: var(--white-color);
  border: solid 5px var(--white-color);
}


.btn.plain {
  box-shadow: none;
  background: var(--white-color);
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