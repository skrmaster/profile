<script lang="ts" setup>


type Prop = {
  head?: TableHead[] | Record<string, any>[];
  data?: Record<string, any>[]
}

const props = withDefaults(defineProps<Prop>(), {
  head: () => [],
  data: () => []
});

const tableRef = ref<HTMLElement>();

const tableWidth = ref(0);
const theadList = toRef(props.head);
const tableData = toRef(props.data);

watch(tableWidth, () => {
  assignmentWidth();
});

function assignmentWidth() {
  const len = theadList.value.length;
  const w = Math.ceil(tableWidth.value / len);
  const cellWidth = w > 180 ? 180 : w;

  for (let i = 0; i < len; i++) {
    let e = theadList.value[i];
    if (i === len - 1) {
      e.width = `${tableWidth.value - i * cellWidth}`
      break;
    }

    if (e.width === 'auto' || !e.width) {
      e.width = `${cellWidth}`;
    }
  }
}

function getTurlyByKey(key: string, val: any) {
  if (Array.isArray(val)) {
    return val.includes(key);
  }
}

onMounted(() => {
  if (tableRef.value) {
    tableWidth.value = tableRef.value.offsetWidth;
  }
});

defineExpose({});
</script>
<template>
  <div ref="tableRef" class="table__container">
    <div class="table__header">
      <table cellspacing="0" cellpadding="0" border="0">
        <colgroup>
          <col 
            v-for="(item, index) in theadList" 
            :key="index" 
            :width="item.width"
          />
        </colgroup>
        <thead>
          <tr>
            <th 
              v-for="(item, index) in theadList" 
              :key="index"
              :class="`${item.align} ${item.class}`"
            >
              <div class="table__cell">{{ item.name }}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table__body">
      <table cellspacing="0" cellpadding="0" border="0">
        <colgroup>
          <col 
            v-for="(item, index) in theadList" 
            :key="index" 
            :width="item.width"
          />
        </colgroup>
        <tr 
          class="table-data__tr"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <td 
            v-for="(e, idx) in theadList" 
            :key="idx"
          >
            <div v-if="!e.operate" class="table__cell">{{ item[e.field] }}</div>
            <div v-else>
              <div class="table__cell">
                <com-tip v-if="getTurlyByKey('edit', e.operate)" class="mr1" content="编辑">
                  <span class="c-p">编辑</span>
                </com-tip>
                <com-tip v-if="getTurlyByKey('delete', e.operate)" content="删除">
                  <span class="c-p">删除</span>
                </com-tip>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style scoped>
.table__container {
  background-color: var(--table-bg-color);
  border-radius: 10px;
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

.table__body {
  padding: 0 2px;
}

.table__cell {
  padding: 5px 8px;
  white-space: nowrap;
}

.table-data__tr {
  background-color: var(--table-tr-border-color);
}
</style>