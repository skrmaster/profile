<script lang="ts" setup>
import { apiGetInfo, apiAdd, apiUpdate } from '~/api/record/request';
import { apiAdd as fileApiAdd } from '~/api/upload/request';
import type { AddModel, EditModel } from '~/api/record/model';
import type { AddModel as FileAddModel } from '~/api/upload/model';
import RecordDetailView from './record-detail-view.vue';

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

const { $message, $sanitize } = useNuxtApp();
const { recordCategory } = options;
const recordName = ref('');
const radioValue = ref('1');
const radioList = ref(recordCategory);
const content = ref('');
const status = ref<string | number | undefined>();
const images = ref<Upload.FileInfo[]>([]);
const fileList = ref<Array<Upload.FileInfo>>([]);
const userSubtitle = ref();
let subtitle: string | undefined;

function init() {
  apiGetInfo(recordId).then(res => {
    content.value = res.data.content ?? '';
    recordName.value = res.data.title;
    radioValue.value = res.data.category.toString();
    status.value = res.data.status;

    userSubtitle.value = res.data.subtitle;
    subtitle = res.data.description;
    const imageIds: Upload.FileInfo[] = res.data.coverImageUrl ? JSON.parse(res.data.coverImageUrl) : [];
    fileList.value = imageIds.map((e) => {
      return {
        id: e.id,
        fullPath: splicingImageUrl(e.fullPath) || ""
      }
    });
  }).catch(e => {

  });
}

function handleSubmit(val: DetailTitle.Action, title: string) {
  let isEdit = false;
  const params: AddModel = {
    title,
    category: radioValue.value,
    content: $sanitize(content.value),
    coverImageUrl: JSON.stringify(images.value),
    subtitle: userSubtitle.value,
    description: subtitle
  }

  if (status.value?.toString()) {
    isEdit = true;
  }

  switch (val) {
    case 'submit':
      params.status = 1;
      break;
    case 'submit-tmp':
      params.status = 0;
      break;
    case 'submit-edit':
      params.status = 1;
      isEdit = true;
      break;
    default:
      break;
  }
  if (!isEdit) {
    apiAdd(params).then(res => {
      $message.show({
        message: res.data ?? res.errors,
        type: res.succeeded ? 'success' : 'info'
      });
      if (res.succeeded) {
        router.back();
      }
    }).catch(() => {

    });
  } else {
    const p: EditModel = {
      ...params,
      id: recordId,
    }

    apiUpdate(p).then(res => {
      $message.show({
        message: res.data ?? res.errors,
        type: res.succeeded ? 'success' : 'info'
      });
      if (res.succeeded) {
        router.back();
      }
    }).catch(e => {

    });
  }
}

async function handleFileUpload(list: Array<Upload.FileInfo | File>) {
  for await (let item of list) {
    if (!isFile(item)) {
      continue;
    }

    const params: FileAddModel = {
      category: 0,
      file: item
    }
    fileApiAdd(params).then(res => {
      images.value.push(res.data)
    }).catch(() => {

    });
  }
}

function handleEditorText(text: string) {
  subtitle = text?.slice(0, 200);
}
</script>
<template>
  <div v-if="mode !== 'view'" class="mode__background">
    <detail-title
      :status="status"
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
          <div class="my1">
            <label>封面</label>
            <com-upload
              label="上传封面"
              :data-list="fileList"
              :limit="1"
              @file-monuted="handleFileUpload"
            ></com-upload>
          </div>
          <div class="my1">
            <label>副标题</label>
            <com-form-input
              class="mt1"
              :is-label="false"
              v-model="userSubtitle"
              placeholder="请输入副标题"
              clearable
            >
            </com-form-input>
          </div>
        </div>
        <wang-editor 
          v-model="content" 
          class="flex1"
          @getText="handleEditorText"
        ></wang-editor>
      </div>
    </section>
    <com-footer></com-footer>
  </div>
  <record-detail-view v-else></record-detail-view>
</template>
<style scoped>
.mode__background {
  background-image: radial-gradient(var(--white-color) 0, var(--background-color) 100%);
  background-blend-mode: screen;
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>