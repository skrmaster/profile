<script lang="ts" setup>
type Prop = {
  head?: TableHead[] | Record<string, any>[];
  data?: Record<string, any>[],
  height?: string;
}

type Position = 'right' | 'center' | 'left';

const emit = defineEmits<{
  'click': [type: TableCell, data: Record<string, any>]
}>();

const props = withDefaults(defineProps<Prop>(), {
  head: () => [],
  data: () => [],
  height: '100%',
});

const tableRef = ref<HTMLElement>();
const scrollContainer = ref<HTMLElement | null>(null);

const tableWidth = ref(0);
const theadList = toRef(() => props.head);
const tableData = toRef(() => props.data);
const resize = new ResizeObserver(callback);
const boxShadow = ref('var(--box-shadow-small)');
const tableGap = 0;
const tableColumnMinWidth = 150;
const layout: Set<Position> = new Set();

const tabelLen = computed(() => {
  return tableData.value.length;
});

const tableHeight = computed(() => {
  return props.height;
});

watch(tableWidth, () => {
  assignmentWidth();
});

watch(tableRef, () => {
  if (tableRef.value) {
    resize.observe(tableRef.value);
  }
});

function getTableColumnMinWidth(maxlength: number, arr: Record<string, any>[]): [number, boolean] {
  let hasWidthCount = 0;
  let len = arr.length;
  let res = Math.floor(maxlength / len);
  
  arr.forEach(e => {
    let w = stringRegexp(e.width, 'number');
    
    let width = w !== null ? w : 0;
    if (width) {
      hasWidthCount++;
      res += Math.floor((res - (width as number)) / (len - 1));   
    }
  });
  return [res, !!hasWidthCount];
}

function assignmentWidth() {
  const len = theadList.value.length;
  let minW = getTableColumnMinWidth(tableWidth.value, theadList.value);
  
  for (let i = 0; i < len; i++) {
    let e = theadList.value[i];
    let w = stringRegexp(e.width, 'number');
    if (!e.width) {
      e.colWidth = minW[0] < tableColumnMinWidth ? tableColumnMinWidth : minW[0];
    } else {
      let width = w !== null ? w[0] : 0;
      width !== 0 ? e.colWidth = width : 0;
    }
  }
}

function getTurlyByKey(key: string, val: any) {
  if (Array.isArray(val)) {
    return val.includes(key);
  }
}

function handleOperate(type: TableCell, data: Record<string, any>) {
  emit('click', type, data);
}

function callback(entries: ResizeObserverEntry[]) {
  for (const entry of entries) {
    const w = entry.contentRect.width;
    tableWidth.value = w;
  }
}

function handleTHeadFixed(type: Fixed): string {
  if (!type) {
    return '';
  }
  const res: string = `column__thead-${type}`;
  return res;
}

function handleTbodyFixed(type: Fixed): string {
  if (!type) {
    return '';
  }
  const res: string = `column__tbody-${type}`;
  return res;
}

function handleScroll() {
  if (scrollContainer.value) {
    const scrollLeft = scrollContainer.value.scrollLeft;
    const maxScrollLeft = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth;
    const arr = Array.from(layout);
    const left = arr.find(e => e === 'left');
    const right = arr.find(e => e === 'right');

    //Todo: 左右fixed阴影
    if (scrollLeft === 0) {
      boxShadow.value = 'var(--box-shadow-small)';
    } else if (scrollLeft === maxScrollLeft) {
      boxShadow.value = '';
    } else {
      boxShadow.value = 'var(--box-shadow-small)';
    }
  }
}

onMounted(() => {
  for (const item of theadList.value) {
    if (item.fixed) {
      layout.add(item.fixed);
    }
  }

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});
</script>
<template>
  <div 
    ref="tableRef" 
    class="table__container flex__column"
    :style="`--table-minheight: ${props.height}; --fixed-layout-boxshadow: ${boxShadow};`"
  >
    <div ref="scrollContainer" class="table__scroll flex1 flex__column">
      <div class="table__header">
        <table cellspacing="0" cellpadding="0" border="0"
          :style="{
            width: `${tableWidth - tableGap}px`
          }"
        >
          <colgroup>
            <col 
              v-for="(item, index) in theadList" 
              :key="index" 
              :width="item.colWidth"
            />
          </colgroup>
          <thead>
            <tr>
              <th 
                v-for="(item, index) in theadList" 
                :key="index"
                :class="`${item.align ? item.align : ''} ${item.class ? item.class : ''} ${handleTHeadFixed(item.fixed)}`"
              >
                <div class="table__cell">{{ item.name }}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table__body"
        :style="{
          height: tableHeight
        }"
        :class="{
          'flex1 flex__center': tabelLen === 0
        }"
      >
        <table 
          v-if="tabelLen > 0"
          cellspacing="0" 
          cellpadding="0" 
          border="0"
          :style="{
            width: `${tableWidth - tableGap}px`,
            'table-layout': 'fixed'
          }"
        >
          <colgroup>
            <col 
              v-for="(item, index) in theadList" 
              :key="index" 
              :width="item.colWidth"
            />
          </colgroup>
          <tr 
            class="table-data__tr"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <td 
              class="table__td"
              :class="`${handleTbodyFixed(e.fixed)}`"
              v-for="(e, idx) in theadList" 
              :key="idx"
            >
              <div v-if="e.type === 'div'">
                <slot :name="e.slotName" :data="item"></slot>
              </div>
              <div v-else-if="e.operate">
                <div class="table__cell has--tip">
                  <com-tip v-if="getTurlyByKey('view', e.operate)" class="mr1" content="查看">
                    <!-- <span class="c-p">查看</span>   -->
                    <span class="operate__icon c-p" @click.stop="handleOperate('view', item)">
                      <com-icon icon="profile-see"></com-icon>
                    </span>
                  </com-tip>
                  <com-tip v-if="getTurlyByKey('edit', e.operate)" class="mr1" content="编辑">
                    <!-- <span class="c-p">编辑</span>   -->
                    <span class="operate__icon c-p" @click.stop="handleOperate('edit', item)">
                      <com-icon icon="profile-edit"></com-icon>
                    </span>
                  </com-tip>
                  <com-tip v-if="getTurlyByKey('delete', e.operate)" content="删除">
                    <!-- <span class="c-p">删除</span> -->
                    <span class="operate__icon c-p" @click.stop="handleOperate('delete', item)">
                      <com-icon icon="profile-delete"></com-icon>
                    </span>
                  </com-tip>
                </div>
              </div>
              <div v-else class="table__cell" @click.stop="handleOperate('cell', item)">{{ item[e.field] }}</div>
            </td>
          </tr>
        </table>
        <com-empty v-else></com-empty>
      </div>
    </div>
  </div>
</template>
<style scoped>
.table__container {
  width: 100%;
  max-width: 100%;
  background-color: var(--table-bg-color);
  position: relative;
  overflow: hidden;
}

.table__scroll {
  overflow: auto;
  position: relative;
}

table {
  table-layout: fixed;
  font-size: 16px;
}

table th {
  text-align: start;
  font-weight: bold;
  color: var(--table-th-color);
  height: 68px;
  background-color: var(--table-th-bg-color);
}

table tr {
  min-height: 60px;
  height: 68px;
}

table tr:hover
, table tr:hover .column__thead-right
, table tr:hover .column__thead-left
, table tr:hover .column__tbody-right
, table tr:hover .column__tbody-left {
  background-color: var(--table-tr-bg-color-hover);
}

table .table-data__tr:not(:last-child) .table__td {
  border-bottom: 1px solid var(--table-tr-border-color);
}

.table__header {
  position: sticky;
  top: 0;
  z-index: 999;
}

.table__cell {
  padding: 5px 8px;
}

.table__cell:not(.has--tip) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.operate__icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: var(--table-th-bg-color);
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
}

.operate__icon:hover {
  opacity: 0.8;
}

.column__thead-right {
  position: sticky!important;
  right: 0px;
  background: var(--table-th-bg-color);
  box-shadow: var(--fixed-layout-boxshadow);
}

.column__thead-left {
  position: sticky!important;
  left: 0px;
  background: var(--table-th-bg-color);
  box-shadow: var(--fixed-layout-boxshadow);
}

.column__tbody-right {
  position: sticky!important;
  right: 0px;
  background: var(--table-bg-color);
  box-shadow: var(--fixed-layout-boxshadow);
}

.column__tbody-left {
  position: sticky!important;
  left: 0px;
  background: var(--table-bg-color);
  box-shadow: var(--fixed-layout-boxshadow);
}
</style>