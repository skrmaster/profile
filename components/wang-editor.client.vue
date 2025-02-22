<script lang="ts">
import type { IToolbarConfig, IEditorConfig, IDomEditor } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { DomEditor } from '@wangeditor/editor';
import { apiAdd } from '~/api/upload/request';
import type { AddModel } from '~/api/upload/model';

type InsertFnType = (url: string, alt: string, href: string) => void;

export default {
  props: {
    modelValue: {
      type: String
    }
  },
  components: { Editor, Toolbar },
  setup(props, { emit }) {
    const editorRef = shallowRef();
    const { modelValue } = toRefs(props);
    const valueHtml = ref(modelValue.value);

    const { $message } = useNuxtApp();
    const { uploadSingleFilePath } = apiMap;

    const toolbarConfig: Partial<IToolbarConfig> = {
      toolbarKeys: [
        "headerSelect",
        "blockquote",
        "|",
        "bold",
        "underline",
        "italic",
        {
          "key": "group-more-style",
          "title": "更多",
          "menuKeys": [
            "through",
            "code",
            "sup",
            "sub",
            "clearStyle"
          ]
        },
        "color",
        "bgColor",
        "|",
        "fontSize",
        "fontFamily",
        "lineHeight",
        "|",
        "bulletedList",
        "numberedList",
        "todo",
        {
          "key": "group-justify",
          "title": "对齐",
          "menuKeys": [
            "justifyLeft",
            "justifyRight",
            "justifyCenter",
            "justifyJustify"
          ]
        },
        {
          "key": "group-indent",
          "title": "缩进",
          "menuKeys": [
            "indent",
            "delIndent"
          ]
        },
        "|",
        "emotion",
        "insertLink",
        {
          "key": "group-image",
          "title": "图片",
          "menuKeys": [
            // "insertImage",
            "uploadImage"
          ]
        },
        // {
        //   "key": "group-video",
        //   "title": "视频",
        //   "menuKeys": [
        //     "insertVideo",
        //     "uploadVideo"
        //   ]
        // },
        "insertTable",
        "codeBlock",
        "divider",
        "|",
        "undo",
        "redo",
        "|",
        "fullScreen"
      ]
    }

    function handleMaxLength(editor: IDomEditor) {
      $message.show({
        message: "超过最大字数",
        type: 'warning'
      });
    }

    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      maxLength: 5000,
      MENU_CONF: {
        uploadImage: {
          server: uploadSingleFilePath,
          // form-data fieldName ，默认值 'wangeditor-uploaded-image'
          fieldName: 'file',

          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 2 * 1024 * 1024,

          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 5,

          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],

          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          meta: {
            // token: 'xxx'
          },

          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,

          // 自定义增加 http  header
          headers: {
            // Accept: 'text/x-json',
            // otherKey: 'xxx'
          },

          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,

          // 超时时间，默认为 10 秒
          timeout: 5 * 1000, // 5 秒
           // 上传之前触发
          onBeforeUpload(file: File) { // TS 语法
          // onBeforeUpload(file) {    // JS 语法
              // file 选中的文件，格式如 { key: file }
              return file

              // 可以 return
              // 1. return file 或者 new 一个 file ，接下来将上传
              // 2. return false ，不上传这个 file
          },

          // 上传进度的回调函数
          onProgress(progress: number) {  // TS 语法
          // onProgress(progress) {       // JS 语法
              // progress 是 0-100 的数字
              console.log('progress', progress)
          },

          // 单个文件上传成功之后
          onSuccess(file: File, res: any) {  // TS 语法
          // onSuccess(file, res) {          // JS 语法
              console.log(`${file.name} 上传成功`, res)
          },

          // 单个文件上传失败
          onFailed(file: File, res: any) {   // TS 语法
          // onFailed(file, res) {           // JS 语法
              console.log(`${file.name} 上传失败`, res)
          },

          // 上传错误，或者触发 timeout 超时
          onError(file: File, err: any, res: any) {  // TS 语法
          // onError(file, err, res) {               // JS 语法
              console.log(`${file.name} 上传出错`, err, res)
          },
          // 自定义上传
          async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
          // async customUpload(file, insertFn) {                   // JS 语法
              // file 即选中的文件
              // 自己实现上传，并得到图片 url alt href
              // 最后插入图片
              // insertFn();
              const params: AddModel = {
                category: 0,
                file: file
              }
              apiAdd(params).then((res) => {
                insertFn(splicingImageUrl(res.data.fullPath) || '', res.data.id, '');
              }).catch(() => {});
          }
        }
      }
    }

    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor: any) => {
      editorRef.value = editor;
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default',
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleMaxLength
    };
  },
  watch: {
    modelValue(val: string) {
      this.valueHtml = val;
    },
    valueHtml(newVal) {
      this.$emit('update:modelValue', newVal);
      const text = this.editorRef.getText();
      this.$emit('getText', text);
    }
  }
}
</script>
<template>
  <div class="flex__column">
    <Toolbar class="wangeditor__toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      class="wangeditor__editor flex__column"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @maxLength="handleMaxLength"
    />
  </div>
</template>
<style scoped>
.wangeditor__toolbar {
  border-bottom: 1px solid var(--background-color);
}

.w-e-full-screen-container {
  z-index: 1000;
}

.wangeditor__editor {
  overflow-y: hidden;
  flex: 1;
}

:deep(.wangeditor__editor .w-e-text-container) {
  flex: 1;
}
</style>