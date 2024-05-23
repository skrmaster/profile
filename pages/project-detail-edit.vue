<script lang="ts" setup>
const list = ref<StackItem[]>([]);

const formData = reactive({
  demoAddress: '',
  summary: '',
  introduction: '',
  responsiblePart: ''
});

function handleStackListChange(val: StackItem[]) {
  let remainArr = [];
  let addArr = [];
  
  for (let i = 0; i < val.length; i++) {
    let e = val[i];
    let idx = list.value.findIndex(item => item.name === e.name);

    if (idx > -1) {
      remainArr.push(e);
    } else {
      addArr.push(e);
    }
  }

  list.value.splice(0, list.value.length, ...remainArr, ...addArr);
}
</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <detail-title class="edit__title"></detail-title>
    <section>
      <div class="container flex__column">
        <div>
          <div class="flex__row mt5 flex-wrap">
            <label class="demo__label text-center">
              演示地址
            </label>
            <div class="flex1">
              <com-form-input
                class="demo__input"
                width="625"
                v-model="formData.demoAddress" 
                placeholder="演示地址"
                :is-label="false"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row my2">
            <label class="stack__label flex__center">技术栈</label>
            <!-- <div class="stack flex__center">+</div> -->
            <com-tech-stack 
              :data-list="list"
              mode="add"
              @update="handleStackListChange"
            ></com-tech-stack>
          </div>
          <div class="flex__row--start flex-wrap">
            <label>项目图片</label>
            <div>
              <com-upload></com-upload>
            </div>
          </div>
          <div class="flex__row--start my3 flex-wrap">
            <label>概述</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                :is-label="false"
                placeholder="请输入概述"
                v-model="formData.summary" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row--start my3 flex-wrap">
            <label>介绍</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                :is-label="false"
                placeholder="请输入介绍"
                v-model="formData.introduction" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
          <div class="flex__row--start my3">
            <label>负责部分</label>
            <div class="flex1">
              <com-form-input 
                class="detail__textarea"
                placeholder="请输入负责部分"
                :is-label="false"
                v-model="formData.responsiblePart" 
                type="textarea"
              ></com-form-input>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>
.edit__title {
  position: sticky;
  top: 0;
  background: var(--white-color);
  z-index: 999;
}

.demo__label {
  width: 100px;
  height: 70px;
  line-height: 70px;
  font-size: 18px;
  background-color: var(--white-color);
  border-radius: 20px 0 0 20px;
  margin-right: 4px;
}

.demo__input {
  height: 70px;
  border: 0;
  outline: 0;
  border-radius: 0 20px 20px 0;
}

:deep(.demo__input input) {
  height: 70px;
  background-color: var(--white-color);
  border-radius: 10px;
  text-indent: 1.5em!important;
}

label {
  display: block;
  text-align: center;
  max-width: 100px;
  width: 100px;
  min-width: 50px;
}

.stack {
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  width: 71px;
  height: 37px;
}

.detail__textarea {
  overflow: hidden;
  border: 0;
  outline: 0;
  border-radius: 20px;
  background-color: var(--white-color);
  box-shadow: 0px 5px 11px 0px rgba(0, 0, 0, 0.25);
  max-width: 1500px;
  min-height: 323px;
  width: 100%;
}

:deep(.detail__textarea .form__input-field:focus) {
  background-color: var(--white-color);
}

:deep(.detail__textarea .form__input-field) {
  text-indent: 0;
  height: 323px;
  padding: 20px;
  background-color: var(--readonly-color);
}
</style>