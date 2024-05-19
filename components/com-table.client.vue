<script lang="ts" setup>
type Prop = {
  head?: TableHead[] | Record<string, any>[];
  data?: Record<string, any>[]
}

const emit = defineEmits<{
  'click': [type: TableCell, data: Record<string, any>]
}>();

const props = withDefaults(defineProps<Prop>(), {
  head: () => [],
  data: () => []
});

const tableRef = ref<HTMLElement>();

const tableWidth = ref(0);
const theadList = toRef(() => props.head);
const tableData = toRef(() => props.data);
const resize = new ResizeObserver(callback);
const tableGap = 0;

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
  let res = maxlength / len;
  arr.forEach(e => {
    let w = stringRegexp(e.width, 'number');
    
    let width = w !== null ? w : 0;
    if (width) {
      hasWidthCount++;
      res += Math.abs(res - (width as number)) / (len - hasWidthCount);
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
      e.colWidth = minW[0];
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

defineExpose({});
</script>
<template>
  <div ref="tableRef" class="table__container">
    <div class="table__scroll">
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
                :class="`${item.align ? item.align : ''} ${item.class ? item.class : ''}`"
              >
                <div class="table__cell">{{ item.name }}</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table__body">
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
          <tr 
            class="table-data__tr"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <td 
              class="table__td"
              v-for="(e, idx) in theadList" 
              :key="idx"
            >
              <div v-if="!e.operate" class="table__cell" @click.stop="handleOperate('cell', item)">{{ item[e.field] }}</div>
              <div v-else>
                <div class="table__cell">
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
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped>
.table__container {
  width: 100%;
  max-width: 100%;
  background-color: var(--table-bg-color);
  /* border-radius: 10px; */
}

.table__scroll {
  overflow: auto;
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
  height: 60px;
}

table tr:hover {
  background-color: var(--table-tr-bg-color-hover);
}

table .table-data__tr:not(:last-child) .table__td {
  border-bottom: 1px solid var(--table-tr-border-color);
}

.table__cell {
  padding: 5px 8px;
  white-space: nowrap;
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
</style>