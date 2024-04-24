<script lang="ts" setup>
type Prop = {
  background?: boolean;
  pageSize?: number;
  total?: number;
  currentPage?: number;
  pagerCount?: number;
  groupCount?: number;
  eachPageCount?: number;
  unit?: string;
}

type PageItem = {
  name: number;
  isActive: boolean;
}

const emit = defineEmits<{
  'update:currentPage': [val: number];
  'update:pageSize': [val: number];
}>();

const props = withDefaults(defineProps<Prop>(), {
  background: true,
  pageSize: 2,
  total: 20,
  currentPage: 1,
  pagerCount: 1,
  groupCount: 1,
  eachPageCount: 5,
  unit: '条'
});
const _currentPage = toRef(props.currentPage);
const groupCount = toRef(props.groupCount);
const prevDisable = ref(true);
const nextDisable = ref(false);
const jumpPage = ref<string>('');

const maxPage = computed(() => {
  return Math.ceil(props.total / props.pageSize);
})

const group = computed(() => {
  const pageCount = Math.ceil(props.total / props.pageSize);
  const groupCount = Math.ceil(pageCount / (props.eachPageCount - 1));
  const res: number[][] = Array.from({length: groupCount}).fill([]) as number[][];
  
  res.forEach((e: number[] , i) => {    
    let tmp: number[] = [];
    for (let m = 0; m < props.eachPageCount; m++) {
      tmp.push((m + 1) + i * (props.eachPageCount - 1));
    }    
    res[i] = res[i].concat(tmp);
  });

  return res;
});

const pageItems = computed((): PageItem[] => {  
  const res: number[] = Array.from({ length: props.eachPageCount }, 
    (x: number, i: number) => 
    i + 1 + (props.eachPageCount - 1) * (groupCount.value - 1));
  return res.flatMap(e => {
    if (e > maxPage.value) {
      return [];
    } else {
      return {
        name: e,
        isActive: false
      }
    }
  });
});

watch(jumpPage, (newVal: string) => {
  if (!isNaN(parseInt(newVal))) {
    const val = parseInt(newVal);
    if (val > maxPage.value) {
      return;
    }
    group.value.forEach((e: number[], i: number) => {
      if (e.find(item => item === val)) {
        groupCount.value = i + 1;
      }
    })
    _currentPage.value = val;
  }
});

function handleChangePage(page: number) {
  if (page === 1) {
    prevDisable.value = true;
  } else {
    prevDisable.value = false;
  }

  if (page === Math.ceil(props.total / props.pageSize)) {
    nextDisable.value = true;
  } else {
    nextDisable.value = false;
  }

  _currentPage.value = page;
  emit('update:currentPage', page);
}

function handlePrevPage() {
  if (prevDisable.value) {
    return
  }
  nextDisable.value = false;

  if (_currentPage.value !== (props.eachPageCount - 1) * (groupCount.value - 1) + 1) {
    handleChangePage(--_currentPage.value);
  } else {
    groupCount.value -= 1;
    handleChangePage(--_currentPage.value);
  }
}

function handleNextPage() { 
  if (nextDisable.value) {
    return
  }
  prevDisable.value = false;
  
  if (Math.ceil(props.total / props.pageSize) !== 1) {
    if (_currentPage.value !== 
      (props.eachPageCount - (groupCount.value % props.eachPageCount - 1)) +
      props.eachPageCount * (groupCount.value - 1)
    ) {
      handleChangePage(++_currentPage.value);
    } else {
      groupCount.value += 1;
      handleChangePage(++_currentPage.value);
    }
  }
}

</script>
<template>
  <div class="pagination flex__center">
    <div class="pagination-box" :class="{
      background: props.background
    }">
      <div class="pagination__prev pagination__item flex__center"
        :class="{
          disabled: prevDisable
        }"
        @click="handlePrevPage"
      >
        {{ '<' }}
      </div>
      <div 
        v-for="(item, index) in pageItems" 
        :key="index"
        class="pagination__item flex__center"
        :class="{
          'is-active': _currentPage === item.name
        }"
        @click="handleChangePage(item.name)"
      >
        {{ item.name }}
      </div>
      <div class="pagination__next pagination__item flex__center"
        @click="handleNextPage"
        :class="{
          disabled: nextDisable
        }"
      >
        {{ '>' }}
      </div>
    </div>
    <div class="flex__center mx1">
      <span class="fs14">跳转到：</span>
      <com-form-input 
        class="pagination-input"
        :is-label="false"
        :text-align="'center'"
        :width="60"
        v-model="jumpPage"
        placeholder="页码"
      ></com-form-input>
    </div>
    <div class="flex__center">
      <p class="fs14">共：
        <span>{{ props.total }}</span>
        {{ props.unit }}
      </p>
    </div>
  </div>
</template>
<style scoped>
.pagination {
  height: 80px;
  display: flex;
  flex-flow: row wrap;
}

.pagination-box {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0 -10px;
}

.background .pagination__item {
  background: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
}

.pagination__item:not(.is-active):hover {
  opacity: 0.8;
}

.pagination__item {
  cursor: pointer;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  transition: all .2s ease-in;
}

.pagination__item.is-active {
  color: var(--white-color);
  box-shadow: inset 0px 0px 5px 0px rgba(0, 0, 0, 0.59);
  background: #818181;
}

.pagination__item.disabled {
  color: var(--disabled-color);
  cursor: not-allowed;
}

.pagination-input {
  height: 30px;
  text-align: start;
}
</style>