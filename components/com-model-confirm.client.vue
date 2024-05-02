<script lang="ts" setup>
type Prop = {
  toBody?: boolean;
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  toBody: false,
  modelValue: false,
});
const emit = defineEmits<{
  'update:modelValue': [val: boolean],
  'confirm': [val?: unknown],
  'cannel': [val?: unknown]
}>();

const visible = toRef(props, 'modelValue');

function handleClose() {
  emit('update:modelValue', false);
  emit('cannel');
}

function handleConfirm() {
  emit('confirm');
}
</script>
<template>
  <com-model
    :to-body="props.toBody"
    v-model="visible"
    class="wh100 flex__column--center"
  >
    <div v-bind="$attrs" class="confirm">
      <slot />
      <div class="confirm__box">
        <div class="flex__row--end btn__box">
          <com-button 
            class="cannel__btn flex__row--between mr1" 
            prefix-icon="profileclose-circle" 
            bgColor="var(--cannel-btn-color)"
            @click="handleClose"
          >
            <span class="fs16 color--primary">取消</span>
          </com-button>
          <com-button 
            prefix-icon="profileconfirm"
            class="confirm__btn flex__row--between"
            @click="handleConfirm"
          >
            <span class="fs16">确定</span>
          </com-button>
        </div>
      </div>
    </div>
  </com-model>
</template>
<style scoped>
.confirm {
  max-width: 750px;
  width: 100%;
  box-shadow: var(--box-shadow);
  border-radius: 10px;
  overflow: hidden;
}

.confirm__box {
  padding: 0 20px;
  background: var(--white-color);
  height: 72px;
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 2px solid var(--tag-border-color);
}

.btn__box {
  flex: 1;
}

.cannel__btn { 
  max-width: 100px;
  min-width: 50px;
  width: 100%;
  border: 1px solid var(--primary-border-color);
}

.confirm__btn { 
  max-width: 100px;
  min-width: 50px;
  width: 100%;
}

:deep(.confirm__btn .icon) {
  color: var(--white-color)!important;
}
</style>