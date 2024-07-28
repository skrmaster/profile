<script lang="ts" setup>
import nameListData from '~/public/iconfont/iconfont.json';

type Prop = {
  modelValue: any;
}

const listData = nameListData.glyphs.map(e => e.font_class);
const visible = ref(false);

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>();
const props = withDefaults(defineProps<Prop>(), {

});
const value = ref('');
const tmpValue = ref('');

const propValue = computed(() => {
  return props.modelValue;
});

watch(propValue, (val: any) => {
  value.value = val;
  tmpValue.value = val;
});

function handleOpenChooseBox() {
  visible.value = true;
}

function handelChoose(val: string) {
  tmpValue.value = val;
}

function handleChoosed() {
  visible.value = false;
  value.value = tmpValue.value;
  emit('update:modelValue', tmpValue.value);
}

</script>
<template>
  <div class="flex__row">
    <com-form-input 
      v-bind="$attrs" 
      :is-label="false"
      v-model="value" 
      readonly 
      @click="handleOpenChooseBox"
    ></com-form-input>
    <com-icon v-show="value" class="mx1" :icon="`profile-${value}`"></com-icon>
  </div>
  <com-model-confirm
    v-model="visible"
    @confirm="handleChoosed"
  >
    <div class="choose__content">
      <div class="common__title mb1">请选择图标</div>
      <div class="choose__box">
        <div
          v-for="item in listData" 
          :key="item"
          class="flex__center icon__item" 
          :class="{
            'is-choose': tmpValue === item
          }"
        >
          <div
            class="icon__item--inner"
            @click="handelChoose(item)"
          >
            <com-icon :icon="`profile-${item}`"></com-icon>
          </div>
        </div>
      </div>
    </div>
  </com-model-confirm>
</template>
<style scoped>
.choose__content {
  background-color: var(--white-color);
  padding: 10px 20px;
}

.choose__box {
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
}

.icon__item {
  height: 50px;
  overflow: hidden;
  border-radius: 4px;
  outline: 2px solid var(--readonly-color);
}

.icon__item--inner {
  transition: all .1s ease-in;
}

.icon__item:hover .icon__item--inner {
  transform: scale(2);
}

.icon__item.is-choose {
  outline: 2px solid var(--primary-color);
}
</style>