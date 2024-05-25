<script lang="ts" setup>
import { apiGetInfo } from '~/api/record/request';



const route = useRoute();
const router = useRouter();
const mode = route.params.mode as DetailTitle.Mode;
const recordId = route.query.id as string;

if (mode === 'add') {
  useHead({
    title: '添加记录'
  });
} else if (mode === 'edit') {
  useHead({
    title: '编辑记录'
  });
  init();
}

const recordName = ref('');
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
const content = ref('1232');

watch(content, (v) => {
  console.log(v);
});

function init() {
  apiGetInfo(recordId).then(res => {

  }).catch(e => {

  });
}

function handleSubmit() {

}
</script>
<template>
  <div class="background">
    <detail-title
      :mode="mode"
      :title-value="recordName"
      @button-action="handleSubmit"
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
        <wang-editor v-model="content" class="flex1"></wang-editor>
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