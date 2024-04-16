<script lang="tsx" setup>

const props = defineProps<{
  model: Array<FormConfig>
}>()
const slots = useSlots();

class FormInstance implements Form {
  vnode: VNode;
  config: Array<FormConfig>;
  data: Record<string, string>;

  constructor(config: Array<FormConfig>) {
    this.vnode = (<div></div>);
    this.config = config;
    this.data = {};
    
    for (let i = 0; i < config.length; i++) {
      this.data[this.config[i].field] = '';
    }

    console.log(this.data, "this.data");
    
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
        class="mb4"
        v-model={ this.data[config.field] }
        {...config.elementConfig}
      >
      </com-form-verification-code>
    )
  }
  generateNumberInput() {

  }
  generateRateInput() {

  }
  generateCheckBox() {

  }
  generateRadioBox() {

  }
  renderForm(): VNode {
    return (
      <form>
        { 
          this.config.map((e: FormConfig) => {
            if (e.type === 'verification-code') {
              return this.generateVerificationCode(e);
            } else {
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
          continue;
        }
      }
    }

    return true;
  }
}
const formElement = new FormInstance(props.model);
const elementForm = shallowRef(formElement.renderForm());

function vaildForm(): Promise<boolean> {
  const val = formElement.vaildForm();
  elementForm.value = formElement.renderForm();

  return new Promise((reslove) => {
    return reslove(val);
  });
}

defineExpose({
  vaildForm
})
</script>
<template>
  <elementForm class="flex__center" />
</template>
<style scoped>

</style>