<script lang="ts" setup>
type Prop = {
  modelValue?: string;
  needBg?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: '',
  needBg: true
});
const emit = defineEmits<{
  'update:modelValue': [val: string],
  'search': []
}>();


const search = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
  }
});

function handleSearch() {
  emit('search');
}
</script>
<template>
  <div class="search p-r px1">
    <div class="w100 flex__center search__box">
      <com-form-input
        class="search__input"
        type="search"
        v-model="search"
        :is-label="false"
        :width="1000"
        :clearable="false"
        @keydown.enter="handleSearch"
      >
        <template #prepend>
          <com-icon 
            width="45px"
            height="45px"
            class="ml2 search__icon" 
            icon="profile-search"
          > </com-icon>
        </template>
        <template #append>
          <com-button @click.stop="handleSearch" class="search__btn mr2" plain is-ripple>
            <span class="fs20" style="pointer-events: none">搜索</span>
          </com-button>
        </template>
      </com-form-input>
    </div>
    <image-offset-canvas v-if="props.needBg"></image-offset-canvas>
  </div>
</template>
<style scoped>
.search {
  height: 250px;
  background: var(--white-color);
  border-bottom: 1px solid var(--primary-border-color);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

:deep(input.form__input-field) {
  background: var(--white-color);
  color: var(--primary-color);
}

.search__box {
  position: absolute;
  bottom: 0;
  transform: translateY(50%);
  z-index: 2;
}

.search__icon {
  width: 45px;
  height: 45px;
}

.search__btn {
  width: 100px;
  height: 50px;
}

:deep(.search__input.form__input-box) {
  height: 90px;
  border-width: 3px;
  border-radius: 55px;
}

:deep(.search__input .form__input-field) {
  height: 100%;
  border-radius: 55px;
}
</style>