<script lang="ts" setup>
import { apiGetInfo } from '~/api/record/request';
import type { ListItem } from '~/api/record/model';

const route = useRoute();
const router = useRouter();
const { $message, $sanitize } = useNuxtApp();
const recordId = route.query.id as string;
const { recordCategory } = options;

const editorRef = ref();
const data = reactive<Partial<ListItem>>({
  content: '',
  title: ''
});
const status = ref();

function init() {
  apiGetInfo(recordId).then(res => {
    Object.assign(data, res.data);
    data.content = $sanitize(res.data.content) ?? '';
    data.createTime = timeNullFormat(data.createTime);
    data.updateTime = timeNullFormat(data.updateTime);
    status.value = getListLabel(data.category, recordCategory);
    useHead({ title: data.title });
  }).catch(e => {

  });
}

function goBack() {
  router.back();
}

function handleCopy (event: ClipboardEvent) {
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString();
  const additionalText = `\n\n-- ${data.author?.account + '&' + data.author?.email}所有`;
  const newText = selectedText + additionalText;
  event.preventDefault();
  if (event.clipboardData) {
    event.clipboardData.setData('text/plain', newText);
  }
}

onNuxtReady(() => {
  init();
  document.addEventListener('copy', handleCopy);
});

onUnmounted(() => {
  document.removeEventListener('copy', handleCopy);
});

</script>
<template>
  <NuxtLayout name="header-section-footer">
    <div class="container p1">
      <div class="back__nav mb1 pb1">
        <div class="c-p" @click="goBack">
          <com-icon icon="profile-left"></com-icon>
          返回
        </div>
        <div class="line-wave__up"></div>
      </div>
      <div>
        <div>
          <h1 class="text-center">{{ data.title }}</h1>
          <p class="text-center my1">
            <span>
              <com-icon class="c-d" icon="profile-see"></com-icon>
              查看
              {{ data.view }}
            </span>
            <span class="mx1">
              <com-icon class="c-d" icon="profile-like1"></com-icon>
              点赞
              {{ data.like }}
            </span>
            <span>
              <com-icon class="c-d" icon="profile-collection"></com-icon>
              收藏
              {{ data.collection }}
            </span>
          </p>
        </div>
      </div>
      <p class="my1">
        <span class="mr1 stack__item">{{ status }}</span>
        <span class="mr1">创建时间：{{ data.createTime }}</span>
        <span class="mr1">创建人：{{ data.author?.account || '未知' }}</span>
      </p>
      <div class="w-e-text-container">
        <div v-html="data.content" class="view__editor" data-slate-editor></div>
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>
.c-d {
  cursor: default;
}

:deep(.c-d .icon) {
  cursor: default;
}

.back__nav {
  position: relative;
}

.line-wave__up {
  width: 100%;
  position: absolute;
  bottom: 1px;
  height: 2px;
  background-image: linear-gradient(to right, 
    var(--primary-color) 50%, transparent 50%);
  background-size: 10px 100%;
}

.view__editor {
  padding: 2rem!important;
}

.stack__item {
  position: relative;
  margin: 0 8px 8px 8px;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: var(--box-shadow-small);
}
</style>