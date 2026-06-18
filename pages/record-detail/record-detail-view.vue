<script lang="ts" setup>
import { apiAnonymousRecordCount, apiGetInfo } from "~/api/record/request";
import type { ListItem, CountParam } from "~/api/record/model";

const route = useRoute();
const router = useRouter();
const { $message, $sanitize, $dayjs } = useNuxtApp();
const recordId = route.query.id as string;
const { recordCategory } = options;
const viewJudgeTime = 1000 * 60 * 1;
let timer: ReturnType<typeof setTimeout> | null;
const scrollBarWidth = ref(0);

const editorRef = ref();
const { $prism } = useNuxtApp();
const data = reactive<Partial<ListItem>>({
  content: "",
  title: "",
});
const status = ref();

const recordData = computed(() => {
  return apiGetInfo(recordId);
});

function init() {
  const res = recordData.value;
  if (!res) {
    return;
  }

  Object.assign(data, res);

  data.content = $sanitize(res.content) ?? "";
  nextTick(() => {
    $prism.highlightAll();
  });

  data.createTime = $dayjs(data.createTime, [
    "DD/M/YYYY HH:mm:ss",
    "D/M/YYYY HH:mm:ss",
    "D/MM/YYYY HH:mm:ss",
  ]).format("YYYY-MM-DD");

  data.updateTime = $dayjs(data.updateTime, [
    "DD/M/YYYY HH:mm:ss",
    "D/M/YYYY HH:mm:ss",
    "D/MM/YYYY HH:mm:ss",
  ]).format("YYYY-MM-DD");
  status.value = getListLabel(data.category, recordCategory);
  useHead({
    title: data.title + `-${import.meta.env.VITE_PROJECT_DOMAIN}个人网站`,
    meta: [
      {
        name: "description",
        content: data.description?.slice(0, 150),
      },
    ],
  });
}

function goBack() {
  router.back();
}

function handleCopy(event: ClipboardEvent) {
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString();
  const additionalText = `\n\n-- ${data.author}所有`;
  const newText = selectedText + additionalText;
  event.preventDefault();
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", newText);
  }
}

function handleViewAdd() {
  const params: CountParam = {
    category: 0,
    recordId,
  };

  apiAnonymousRecordCount(params.recordId);
}

function viewCountAddAfter5min() {
  timer = setTimeout(() => {
    handleViewAdd();
  }, viewJudgeTime);
}

onNuxtReady(() => {
  scrollBarWidth.value = getScrollBarWidth();
  init();
  viewCountAddAfter5min();
  document.addEventListener("copy", handleCopy);
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
  document.removeEventListener("copy", handleCopy);
});
</script>
<template>
  <NuxtLayout
    name="header-section-footer"
    bg-change-color="true"
    bg-style-content="display: flex;flex-direction: column;min-height: 100vh;background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);"
  >
    <div class="container p1 flex1">
      <div class="back__nav mb1 pb1">
        <div class="c-p" @click="goBack">
          <com-icon icon="profile-left"></com-icon>
          返回
        </div>
        <div class="line-wave__up"></div>
      </div>
      <div v-if="false">
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
      <p class="my1" style="line-height: 2">
        <span class="mr1 stack__item">{{ status }}</span>
        <span class="mr1">创建时间：{{ data.createTime }}</span>
        <span class="mr1">创建人：{{ data.author || "未知" }}</span>
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

:deep(.background) {
  display: flex;
  flex-direction: column;
}

:deep(.w-e-text-container [data-slate-editor] pre) {
  border-radius: 4px;
}

:deep(.w-e-text-container [data-slate-editor] pre > code) {
  text-shadow: none;
  background-color: var(--code-bg-color) !important;
  border: 0;
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--white-color);
}

:deep(pre[class*="language-"]) {
  padding: 0;
  margin: 0;
  background-color: var(--code-bg-color);
}

.back__nav {
  position: relative;
}

.line-wave__up {
  width: 100%;
  position: absolute;
  bottom: 1px;
  height: 2px;
  background-image: linear-gradient(
    to right,
    var(--primary-color) 50%,
    transparent 50%
  );
  background-size: 10px 100%;
}

.view__editor {
  padding: 2rem !important;
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
