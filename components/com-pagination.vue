<script lang="ts" setup>
type Prop = {
  background?: boolean;
  pageSize?: number;
  pageSizes?: Array<number>;
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
  'pageSizeChange': [],
  'currentPageChange': []
}>();

const props = withDefaults(defineProps<Prop>(), {
  background: true,
  pageSize: 20,
  total: 0,
  currentPage: 1,
  pagerCount: 1,
  groupCount: 1,
  eachPageCount: 5,
  unit: '条',
  pageSizes: () => [20, 40, 60, 80, 100]
});

const paginationRef = ref();

const currentPage = toRef(props.currentPage);
const groupCount = toRef(props.groupCount);
const prevDisable = ref(true);
const nextDisable = ref(true);
const jumpPage = ref<string>('');
const currentPageSize = ref(props.pageSize);
const pageSizeList = toRef(() => props.pageSizes);
const isCenterLayout = ref(true);
let elementResize: ResizeObserver | null = null;

const currentPageValue = computed(() => {
  return props.currentPage
});

watch(currentPageValue, (val) => {
  if (val === 1) {
    groupCount.value = 1;
  }
});

const maxPage = computed(() => {
  const page = Math.ceil(props.total / props.pageSize);
  return page;
});

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
  if (!isNaN(parseInt(newVal)) && parseInt(newVal) >= 1) {
    const val = parseInt(newVal);
    if (val > maxPage.value) {
      return;
    }
    group.value.forEach((e: number[], i: number) => {
      if (e.find(item => item === val)) {
        groupCount.value = i + 1;
      }
    })
    currentPage.value = val;
    emit('currentPageChange');
  }
});

watch(maxPage, (page) => {
  if (page === 1) {
    prevDisable.value = true;
    nextDisable.value = true;
  } else {
    if (props.currentPage === page) {
      prevDisable.value = false;
      nextDisable.value = true;
    }
  }

  if (page > 1) {
    prevDisable.value = true;
    nextDisable.value = false;
  }
});

watch(currentPageSize, (val) => {  
  if (val) {
    emit('update:pageSize', val);
    emit('pageSizeChange');
  } else {
    emit('update:pageSize', pageSizeList.value[0]);
    emit('pageSizeChange');
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

  currentPage.value = page;
  emit('update:currentPage', page);
  emit('currentPageChange');
}

function handlePrevPage() {
  if (prevDisable.value) {
    return
  }
  nextDisable.value = false;

  if (currentPage.value !== (props.eachPageCount - 1) * (groupCount.value - 1) + 1) {
    handleChangePage(--currentPage.value);
  } else {
    groupCount.value -= 1;
    handleChangePage(--currentPage.value);
  }
}

function handleNextPage() { 
  if (nextDisable.value) {
    return
  }
  prevDisable.value = false;
  
  if (Math.ceil(props.total / props.pageSize) !== 1) {
    if (currentPage.value !== 
      (props.eachPageCount - (groupCount.value % props.eachPageCount - 1)) +
      props.eachPageCount * (groupCount.value - 1)
    ) {
      handleChangePage(++currentPage.value);
    } else {
      groupCount.value += 1;
      handleChangePage(++currentPage.value);
    }
  }
}

const debounceFunction = debounce(handleLayout, 500);
function handleLayout() {
  const res = hasHorizontalScrollbar(paginationRef.value);
  isCenterLayout.value = !res;
}

watch(paginationRef, (val) => {
  if (val) {
    elementResize = resize(paginationRef.value, (wh) => {
      debounceFunction();
    });
  }
});

onBeforeUnmount(() => {
  elementResize?.unobserve(paginationRef.value);
});
</script>
<template>
  <div ref="paginationRef" 
    class="pagination" 
    :class="{
      'flex__center': isCenterLayout,
      'flex__row--start': !isCenterLayout
    }"
    v-if="props.total > 0"
  >
    <div class="pagination-box" :class="{
      background: props.background
    }">
      <div class="pagination__prev pagination__item flex__center"
        :class="{
          disabled: prevDisable
        }"
        @click="handlePrevPage"
      >
        <com-icon 
          icon="profile-left" 
          class="pagination__control"
          :color="prevDisable ? 'var(--disabled-color)' : 'currentcolor'"
        ></com-icon>
      </div>
      <div 
        v-for="(item, index) in pageItems" 
        :key="index"
        class="pagination__item flex__center"
        :id="`${item.name}`"
        :class="{
          'is-active': currentPageValue === item.name
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
        <com-icon 
          icon="profile-left" 
          class="pagination__control icon__right"
          :color="nextDisable ? 'var(--disabled-color)' : 'currentcolor'"
        ></com-icon>
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
        type="number"
        :min-value="1"
        placeholder="页码"
      ></com-form-input>
    </div>
    <div class="flex__center mr1">
      <p class="fs14">共:
        <span>{{ props.total }}</span>
        {{ props.unit }}
      </p>
    </div>
    <div class="flex__center">
      <com-select 
        v-model="currentPageSize"
        :option-list="pageSizeList"
        :placeholder="`${pageSizeList[0]}/页`"
      ></com-select>
    </div>
  </div>
</template>
<style scoped>
.pagination {
  height: 80px;
  display: flex;
  flex-flow: row nowrap;
  overflow: auto;
}

.pagination-box {
  display: flex;
  flex-flow: row nowrap;
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
  min-width: 50px;
  height: 30px;
  text-align: start;
}

.icon__right {
  transform: rotate(180deg);
}

.pagination__control {
  pointer-events: none;
}
</style>