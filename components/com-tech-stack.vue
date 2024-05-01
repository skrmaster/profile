<script lang="ts" setup>
import data from '@/mocks/data.json';

type Mode = 'add' | 'view' | 'delete' | 'single-choose' | 'multiple-choose';

type Prop = {
  mode?: Mode;
  dataList?: StackItem[];
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
const multiple: number[] = [];
const deleteInfo = ref<number[]>([]);

const visible = ref(true);
const list = toRef<StackItem[]>(props.dataList);
const chooseList = ref<StackItem[]>([]);
const deleteList = ref<StackItem[]>([]);
const tagList = ref<StackItem[]>(data.tagList);
const chooseLen = computed(() => {
  return chooseList.value.length;
});

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

    console.log(JSON.parse(JSON.stringify(list.value)));
    
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
    console.log(multiple, 'multiple');
    
    
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
    if (chooseList.value.find(item => item.name === e.name)) {
      continue;
    } else {
      chooseList.value.push({
        ...e,
        isChoose: false
      });
    }
  }
  console.log(chooseList.value);
  
}

function handleDeleteArea(val: StackItem[]) {
  console.log(val, 'val');
  
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
      const idx = multiple.findIndex(e => e === i);
      console.log(multiple, i, idx, 'idx');
      
      if (idx > -1) {
        multiple.splice(idx, 1);
      }
    }
  });
}

function handleDelete(index: number) {
  if (deleteInfo.value.length > 0) {
    deleteInfo.value.push(index);
  } else {
    if (!deleteInfo.value.includes(index)) {
      deleteInfo.value.push(index);
    }
  }
  deleteList.value.push(list.value[index]);
  list.value.splice(index, 1);
  emit('update', deleteList.value);
}

function handleClose() {
  emit('update', chooseList.value);
}

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
      @click="handleChoose(index)"
    >
      <div class="item__image flex__center">
        <img :src="item.icon" :alt="item.name" />
      </div>
      <span class="flex__center stack__name line1__ellipsis">{{ item.name }}</span>
      <com-icon 
        v-if="props.mode === 'delete'"
        @click="handleDelete(index)"
        class="icon__close"
        icon="profileclose-circle"
      ></com-icon>
    </div>
    <div v-if="props.mode === 'add'" class="stack__item flex__center c-p">+</div>
  </div>
  <com-model-confirm
    v-if="mode === 'add'"
    v-model="visible"
    @cannel="handleClose"
  >
    <div class="stack__choose">
      <div class="flex__row h100">
        <div class="choose__area flex__column h100">
          <p class="common__title">技术栈</p>
          <div class="flex1 mt1">
            <com-tech-stack 
              :data-list="tagList" 
              @update="handleChooseArea"
              mode="multiple-choose"
            ></com-tech-stack>
          </div>
        </div>
        <div class="confirm__area h100">
          <p class="mb1">已选择: {{ chooseLen }}个</p>
          <com-tech-stack 
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