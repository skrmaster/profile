<script lang="ts" setup>

const title = ref('添加记录');
useHead({
  title
});
const formData = reactive({
  demoAddress: '',
  summary: '',
  introduction: '',
  responsiblePart: ''
});

const radioValue = ref('1');
const radioList = ref([
  {
    label: '原创',
    value: '1'
  },
  {
    label: '转载',
    value: '2'
  }
]);

</script>
<template>
  <div class="background">
    <detail-title 
      :placeholder="'记录名称'" 
      class="edit__title"
    ></detail-title>
    <section class="flex1 flex__column">
      <div class="container flex__column flex1 mb1">
        <div class="my1">
          <com-radio 
            v-model="radioValue"
            :list="radioList"
          ></com-radio>
        </div>
        <wang-editor class="flex1"></wang-editor>
      </div>
    </section>
    <com-footer></com-footer>
  </div>
</template>
<style scoped>
.background {
  background-image: radial-gradient(#ffffff 0, var(--background-color) 100%);
  background-blend-mode: screen;
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>