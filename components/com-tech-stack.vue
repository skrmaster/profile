<script lang="ts" setup>
import data from '@/mocks/data.json';

type Mode = 'add' | 'view' | 'delete' | 'single-choose' | 'multiple-choose';

type Prop = {
  mode?: Mode;
  dataList?: StackItem[];
}

type ChooseRef = HTMLElement & { 
  multiple: number[];
  chooseList: StackItem[];
  deleteList: StackItem[];
}

const props = withDefaults(defineProps<Prop>(), {
  mode: 'add',
  dataList: () => [],
});

const emit = defineEmits<{
  'update': [val: StackItem[]]
}>();

const single = reactive<{
  chooseIndex: null | number;
}>({
  chooseIndex: null,
});
const chooseAreaRef = ref<ChooseRef>();
const deleteAreaRef = ref<ChooseRef>();

const multiple: number[] = [];
const visible = ref(false);
const list = toRef<StackItem[]>(props.dataList);
const chooseList = ref<StackItem[]>([]);
const deleteList = ref<StackItem[]>([]);
const tagList = ref<StackItem[]>(initData());
const chooseLen = computed(() => {
  return chooseList.value.length;
});

function initData(): StackItem[] {
  const arr = props.dataList;
  if (Array.isArray(arr) && arr.length > 0) {
    data.tagList.forEach(e => {
      if (arr.find(item => item.name === e.name)) {
        e.isChoose = true;
        chooseList.value.push({
          ...e,
          isChoose: false
        });
      }
    });
  }
  
  return data.tagList;
}

function handleEdit() {
  visible.value = true;
}

function handleChoose(index: number) {
  if (props.mode === 'single-choose') {
    if (single.chooseIndex === null) {
      single.chooseIndex = index;
    } else {
      list.value[single.chooseIndex].isChoose = false;
      list.value[index].isChoose = true;
    }
    chooseList.value = [list.value[index]];
    emit('update', chooseList.value);
    return;
  }

  if (props.mode === 'multiple-choose') {
    const item = list.value[index];
    
    if (multiple.length === 0) {
      multiple.push(index);
    } else {
      if (!multiple.includes(index)) {
        multiple.push(index);
      }

      multiple.forEach((e) => {
        list.value[e].isChoose = true;
      });
    }
    
    if (!chooseList.value.find(e => e.name === item.name)) {
      chooseList.value.push(item);
      list.value[index].isChoose = true;
    }
    emit('update', chooseList.value);
    return;
  }
}

function handleChooseArea(val: StackItem[]) {
  for (let i = 0; i < val.length; i++) {
    let e = val[i];
    let idx = deleteList.value.findIndex(item => item.name === e.name);
    
    if (idx > -1) {
      deleteList.value.splice(idx, 1);
      deleteAreaRef.value!.deleteList.splice(idx, 1);
    }
    if (chooseList.value.find(item => item.name === e.name)) {
      continue;
    } else {
      chooseList.value.push({
        ...e,
        isChoose: false
      });
    }
  }
}

function handleDelete(index: number) {
  deleteList.value.push(list.value[index]);
  list.value.splice(index, 1);
  emit('update', deleteList.value);
}

function handleDeleteArea(val: StackItem[]) {
  for (let i = 0; i < val.length; i++) {
    let e = val[i];
    if (deleteList.value.find(item => item.name === e.name)) {
      continue;
    } else {
      deleteList.value.push({
        ...e,
        isChoose: false
      });
    }
  }

  tagList.value.forEach((e, i) => {
    if (deleteList.value.find(item => item.name === e.name)) {
      e.isChoose = false;
      const idx = chooseAreaRef.value!.multiple.findIndex(e => e === i);
      
      let s = chooseAreaRef.value!.chooseList
        .findIndex(item => item.name === e.name);
      if (s > -1) {
        chooseAreaRef.value!.chooseList.splice(s, 1);
      }

      if (idx > -1) {
        chooseAreaRef.value!.multiple.splice(idx, 1);
      }
    }
  });
}

function handleClose() {
  visible.value = false;
}

function handleConfirm() {
  emit('update', chooseList.value);
  visible.value = false;
}

defineExpose({
  multiple,
  chooseList,
  deleteList
});
</script>
<template>
  <div class="stack flex__row flex-wrap">
    <div 
      class="stack__item c-p flex__center"
      v-for="(item, index) in list"
      :key="index"
      :class="{
        'choosed': item.isChoose
      }"
      @click.stop="handleChoose(index)"
    >
      <div class="item__image flex__center">
        <img :src="item.icon" :alt="item.name" />
      </div>
      <span class="flex__center stack__name line1__ellipsis">{{ item.name }}</span>
      <com-icon 
        v-if="props.mode === 'delete'"
        @click.stop="handleDelete(index)"
        class="icon__close"
        icon="profileclose-circle"
      ></com-icon>
    </div>
    <div 
      v-if="props.mode === 'add'" 
      class="stack__item flex__center c-p"
      @click.stop="handleEdit"
    >+</div>
  </div>
  <com-model-confirm
    v-if="mode === 'add'"
    v-model="visible"
    @confirm="handleConfirm"
    @cannel="handleClose"
  >
    <div class="stack__choose">
      <div class="flex__row h100">
        <div class="choose__area flex__column h100">
          <p class="common__title">技术栈</p>
          <div class="flex1 mt1">
            <com-tech-stack 
              ref="chooseAreaRef"
              :data-list="tagList" 
              mode="multiple-choose"
              @update="handleChooseArea"
            ></com-tech-stack>
          </div>
        </div>
        <div class="confirm__area h100">
          <p class="mb1">已选择: {{ chooseLen }}个</p>
          <com-tech-stack 
            ref="deleteAreaRef"
            mode="delete"
            :data-list="chooseList"
            @update="handleDeleteArea"
          ></com-tech-stack>
        </div>
      </div>
    </div>
  </com-model-confirm>
</template>
<style scoped>
.stack {
  margin: 0 -8px;
}

.stack__item {
  position: relative;
  margin: 0 8px 8px 8px;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
}

.stack__item.choosed {
  background-color: var(--tag-choose-bg-color);
}

.stack__item.choosed img {
  filter: grayscale(100%);
}

.item__image {
  width: 25px;
  height: 25px;
  margin-right: 2px;
}

.item__image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.icon__close {
  position: absolute;
  top: -50%;
  right: 0;
  z-index: 999;
  transform: translate(50%, 50%);
  border-radius: 50%;
  background-color: var(--white-color);
}

.stack__name {
  max-width: 150px;
  width: 100%;
  text-transform: capitalize;
}

.stack__choose {
  padding: 24px;
  height: 380px;
  width: 100%;
  background-color: var(--white-color)
}

.choose__area {
  flex: 1;
}

.confirm__area {
  width: 146px;
  border-left: 2px solid var(--tag-border-color);
  padding: 0 18px;
  overflow-y: auto;
}
</style>