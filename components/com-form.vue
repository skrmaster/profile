<script lang="tsx" setup>
const props = defineProps<{
  model: Array<FormConfig>
}>();
const slots = useSlots();
const model = computed(() => {
  return props.model;
});
const emit = defineEmits<{
  'sendMailCode': [val: Record<string, string>];
  'uploadFile': [val: Array<Upload.FileInfo | File>];
}>();

function handleSendMail(val: Record<string, string>) {
  emit('sendMailCode', val);
}

function handleFileUpload(list: Array<Upload.FileInfo | File>) {
  emit('uploadFile', list);
}

class FormInstance implements Form {
  vnode: VNode;
  config: Array<FormConfig>;
  data: Record<string, string>;

  constructor(config: Array<FormConfig>) {
    this.vnode = (<></>);
    this.config = config;
    this.data = {};
    
    for (let i = 0; i < this.config.length; i++) {
      this.data[this.config[i].field] = this.config[i].data || '';
    }
  }
  generateSelect(config: FormConfig): VNode {

    if (config.elementConfig?.layout && config.elementConfig.layout == 'column') {
      return (
        <div class="mb1 w100">
          <com-select
            v-model={ this.data[config.field] }
            { ...config.elementConfig }
          >
          </com-select>
        </div>
      )
    } else {
      return (
        <>
          <com-select
            v-model={ this.data[config.field] }
            { ...config.elementConfig }
          >
          </com-select>
        </>
      )
    }
  }
  generateTextInput(config: FormConfig): VNode {
    return (
      <com-form-input
        class="mb1"
        v-model={ this.data[config.field] }
        {...config.elementConfig}
        type={ config.type }
      >
      </com-form-input>
    )
  }
  generateVerificationCode(config: FormConfig): VNode {
    return (
      <com-form-verification-code 
        class="mb1"
        v-model={ this.data[config.field] }
        { ...config.elementConfig }
        onSendMail={ () => handleSendMail(this.data) }
      >
      </com-form-verification-code>
    )
  }
  generateSwitch(config: FormConfig): VNode{
    if (config.elementConfig?.layout && config.elementConfig.layout == 'column') {
      return (
        <div class="mb1 w100">
          <com-switch
            v-model={ this.data[config.field] }
            { ...config.elementConfig }
          ></com-switch>
        </div>
      )
    } else {
      return (
        <>
          <com-switch
            class="mb1"
            v-model={ this.data[config.field] }
            { ...config.elementConfig }
          ></com-switch>
        </>
      )
    }
  }
  generateNumberInput(config: FormConfig): VNode {
    return (<></>)
  }
  generateRateInput(config: FormConfig): VNode {
    return (<></>)
  }
  generateUploadFile(config: FormConfig): VNode {
    return (
      <com-upload 
        label={ config.elementConfig.label }
        data-list={ config.elementConfig.fileList }
        limit={ config.elementConfig.limit }
        onFileMonuted={ handleFileUpload }
        class="mb1"
      ></com-upload>
    )
  }
  generateCheckBox(config: FormConfig): VNode {
    return (
      <com-form-checkbox
        class="mb1 w100"
        v-model={ this.data[config.field] }
        {...config.elementConfig}
      ></com-form-checkbox>
    )
  }
  generateRadioBox(config: FormConfig): VNode {
    return (<></>)
  }
  generateIconList(config: FormConfig): VNode {
    return (<>
      <com-icon-list 
        v-model={ this.data[config.field] }
        { ...config.elementConfig }
      ></com-icon-list>
    </>)
  }
  renderForm(): VNode {
    return (
      <form>
        { 
          this.config.map((e: FormConfig) => {
            if (e.type === 'verification-code') {
              return this.generateVerificationCode(e);
            } else if (e.type === 'checkbox') {
              return this.generateCheckBox(e);
            } else if (e.type === 'select') {
              return this.generateSelect(e);
            } else if (e.type === 'switch') {
              return this.generateSwitch(e);
            } else if (e.type === 'upload') {
              return this.generateUploadFile(e);
            } else if (e.type === 'icon-choose') {
              return this.generateIconList(e);
            }
            else {
              return this.generateTextInput(e);
            }
          }) 
        }
        { slots && slots.default ? slots.default() : null }
      </form>
    )
  }
  vaildForm() {    
    for (let i = 0; i < this.config.length; i++) {
      if (this.config[i].require) {
        const currentRowVaild = vaildTest(this.data[this.config[i].field], this.config[i].rule);
        
        if (!currentRowVaild[0]) {
          this.config[i].elementConfig.isError = true;
          return false;
        } else {
          this.config[i].elementConfig.isError = false;
          continue;
        }
      }
    }

    return true;
  }
}

const formElement = computed(() => {
  return new FormInstance(model.value)
});
const elementForm = shallowRef(formElement.value.renderForm());

watch(formElement, () => {
  refreshDom();
});

function vaildForm(): Promise<ReturnVaildForm> {
  const val = formElement.value.vaildForm();
  refreshDom();
  const res: ReturnVaildForm = {
    vaild: val,
    data: formElement.value.data,
  }

  return new Promise((reslove) => {
    return reslove(res);
  });
}

function refreshDom() {
  elementForm.value = formElement.value.renderForm();
}

defineExpose({
  vaildForm
});
</script>
<template>
  <elementForm class="flex-wrap"></elementForm>
</template>
<style scoped>

</style>