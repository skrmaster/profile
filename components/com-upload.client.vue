<script lang="ts" setup>
type FileType = {
  dataList?: Array<Upload.FileInfo>;
  multiple?: boolean;
  accept?: string;
  previewType?: 'file-list' | 'image-list';
  limit?: number;
  label?: string;
}

const emit = defineEmits<{
  'fileMonuted': [list: File[] | Upload.FileInfo[]]
}>()

const props = withDefaults(defineProps<FileType>(), {
  dataList: () => [],
  multiple: true,
  accept: '*',
  previewType: 'image-list',
  limit: 5
});

const slotsVue = useSlots();
const previewRef = ref();

const { $message } = useNuxtApp();
const fileList = ref<File[] & Upload.FileInfo[]>([]);
const outDatalist = ref<Upload.FileInfo[]>([]);
const fileInput = ref<HTMLInputElement>();
const previewList = ref<string[]>([]);
const isImageList = computed(() => {
  return props.previewType === 'image-list';
});

const showAddArea = computed(() => {
  return fileList.value.length < props.limit;
});

watch(() => props.dataList, (val) => {
  const really = val.flatMap(e => {
    if (e.fullPath && e.id) {
      return e;
    } else {
      return [];
    }
  });
  
  outDatalist.value = really;
  fileList.value = [];
  fileList.value.splice(0, 0, ...really);
});

function handleUpload() {
  fileInput.value?.click();
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  
  if (target && target.files) {
    for (let i = 0; i < target.files.length; i++) {
      let item = target.files[i];
      if (fileList.value) {
        if (fileList.value.find((e) => e.name === item.name)) {
          continue;
        } else {
          fileList.value.splice(fileList.value.length, 0, item);
          if (fileList.value.length === props.limit) {
            break;
          }
        }
      }
    }
    clearInputValue();
  }

  emit('fileMonuted', [...unref(outDatalist), ...unref(fileList)])
}

function handleRemoveFile(index: number) {
  fileList.value.splice(index, 1);
}

function clearInputValue() {
  if (fileInput.value) {
    fileInput.value.value = '';
    fileInput.value.files = null;
  }
}

function handlePreview(item: File | Upload.FileInfo) {
  let url: string | undefined;
  if (isFile(item)) {
    url = blobToUrl(item);
  } else {
    url = item.fullPath;
  }

  if (!url) {
    $message.show({
      message: '无法预览无法加载的图片',
      type: 'error'
    });
    return;
  }
  previewList.value = [url]
  previewRef.value.open();
}

function blobToUrl(item: File): string | undefined {
  let res: string;
  try {
    res = URL.createObjectURL(item);
    return res;
  } catch {
    return;
  }
}

</script>
<template>
  <div class="flex__row--start">
    <label v-if="!isImageList" class="mr2">上传文件</label>
    <div v-if="!isImageList" @click="handleUpload">
      <com-button 
        v-if="!slotsVue.trigger" 
        class="btn" plain 
      >上传文件</com-button>
      <slot name="trigger" />
    </div>
    <transition-group 
      :class="{
        'file__list': isImageList
      }"
      v-if="fileList.length > 0 || isImageList" 
      class="p-r"
      name="list__fade" 
      tag="ul"
    >
      <li 
        v-for="(item, index) in fileList" 
        :key="item.name"
        :class="{
          'image__item': isImageList
        }"
      >
      <div 
          v-if="props.previewType === 'file-list'" 
          class="file__item flex__row--between"
        >
          <span class="fs18">{{ item.name }}</span>
          <div>
            <com-icon 
              class="mr1"
              icon="profile-see" 
              title="查看"
              @click="handlePreview(item)"
            ></com-icon>
            <com-icon 
              title="删除"
              icon="profile-circle-close" 
              @click="handleRemoveFile(index)"
            ></com-icon>
          </div>
        </div>
        <div 
          v-else-if="props.previewType === 'image-list'"
          class="flex1 flex__center"
        >
          <img :src="item.fullPath || blobToUrl(item)" :alt="item.name" />
          <div class="overmark flex__center">
            <div class="overmark__icon flex__row--between">
              <com-icon
                width="20px"
                height="20px"
                icon="profile-enlarge"
                color="var(--white-color)"
                @click="handlePreview(item)"
              ></com-icon>
              <com-icon
                width="20px"
                height="20px"
                icon="profile-delete"
                color="var(--white-color)"
                @click="handleRemoveFile(index)"
              ></com-icon>
            </div>
          </div>
        </div>
      </li>
      <li :key="Date.now">
        <div v-if="isImageList && showAddArea"
          class="image__add flex__center c-p" 
          @click="handleUpload"
        >
          <com-icon 
            v-if="!props.label"
            class="add__icon" 
            width="30px" 
            height="30px" 
            icon="profile-close"
          ></com-icon>
          <label class="c-p" v-else>{{ props.label }}</label>
        </div>
      </li>
    </transition-group>
    <input 
      ref="fileInput" 
      class="file__input" 
      type="file"
      :multiple="props.multiple"
      :accept="props.accept"
      name="file"
      @change="handleFileChange"
    />
    <com-preview-image 
      ref="previewRef" 
      :image-urls="previewList"
    ></com-preview-image>
  </div>
</template>
<style scoped>
.file__input {
  display: none;
}

.btn {
  width: 100px;
}

.file__item {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 2px 10px;
  border-radius: 5px;
}

.file__item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.file__list {
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0 -8px;
  list-style-type: none;
  user-select: none;
}

.image__item {
  width: 126px;
  height: 126px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--primary-border-color);
  margin: 8px;
  display: inline-flex;
  transition: all .5s cubic-bezier(0.55, 0, 0.1, 1) 0s;
}

.image__item img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.overmark {
  display: none!important;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--model-bg-color);
}

.overmark__icon {
  max-width: 50px;
  width: 100%;
}

.image__item:hover .overmark {
  display: flex!important;
}

.image__add {
  margin: 8px;
  width: 126px;
  height: 126px;
  border: 1px dashed var(--primary-border-color);
  border-radius: 10px;
}

.add__icon {
  transform: rotate(45deg);
}
</style>