<script lang="ts" setup>
const router = useRouter();
const title = ref('数字天研系统项目');
const list = ref<StackItem[]>([
  {
    name: 'vuejs',
    icon: 'https://vuejs.org/images/logo.png',
    officalUrl: 'https://vuejs.org',
    isChoose: false
  },
  {
    name: 'reactjs',
    icon: 'https://react.dev/images/og-home.png',
    officalUrl: 'https://react.dev',
    isChoose: false
  }
]);
const detailList = ref([
  {
    label: '概述',
    content: '该产品属于企业服务，服务是对请假审批流程、月计划资金审批流程等一系列流程的统一管理包括发起，领导审批，通过，实施，生成报告。该项目属于国企外包项目，推动相关部门的无纸化办公进程。'
  },
  {
    label: '介绍',
    content: '人员由3名前端和3名后端组成。前端使用vuejs框架后端使用java语言构建。前后端使用swagger对接数据。前端使用公司二次封装的elementUI的组件库。'
  },
  {
    label: '负责部分',
    content: '负责工作需求对接涉及发起工作流程与办理工作流程，提供设计建议，将用户提供或者是需要的execl表格模板文件在系统中复现。'
  }
]);

useHead({
  title
});

function goBack() {
  router.back();
}

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
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <section>
      <div class="container">
        <div class="title flex__center mt2 mb3">
          <div class="back">
            <div class="flex__row" @click="goBack">
              <com-icon 
                width="20px" 
                height="40px" 
                icon="profileleft"
              ></com-icon>
              <span class="fs24 nowrap display-0-none c-p">返回</span>
            </div>
          </div>
          <div class="flex__center">
            <div class="text-center title__bg">
              <span class="font-bold fs24">{{ title }}</span>
            </div>
          </div>
        </div>
        <com-carousel></com-carousel>
        <div class="stack__box">
          <p><label>技术栈</label></p>
          <div class="my1">
            <com-tech-stack 
              :data-list="list"
              mode="view"
              @update="handleStackListChange"
            ></com-tech-stack>
          </div>
        </div>
        <div class="flex__column">
          <div 
            v-for="(item, index) in detailList"
            :key="index"
            class="stack-content mb2"
          >
            <div class="stack-content__label">
              <label class="common__title fs18">{{ item.label }}</label>
            </div>
            <div class="content__item">
              <p class="fs16">{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </NuxtLayout>
</template>
<style scoped>
.title {
  height: 100px;
  position: relative;
}

.back {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}

.title__bg {
  position: relative;
  padding: 16px 50px;
  background: #eeeeee;
  border-radius: 10px;
}

.stack-content:hover .stack-content__label {
  box-sizing: content-box!important;
  border-top: 1px solid var(--primary-border-color);
  border-left: 1px solid var(--primary-border-color);
  border-right: 1px solid var(--primary-border-color);
}

.stack-content:hover .content__item {
  box-sizing: content-box!important;
  border: 1px solid var(--primary-border-color);
}

.stack__box {
  min-height: 200px;
}

.stack-content__label {
  padding: 10px 20px;
  display: inline-block;
  background: var(--white-color);
  border: 1px solid transparent;
  border-radius: 10px 10px 0 0;
  position: relative;
  top: 1px;
  z-index: 11;
}

.content__item {
  padding: 20px;
  background: var(--white-color);
  border-radius: 0 10px 10px 10px;
  position: relative;
  z-index: 10;
  border: 1px solid transparent;
}
</style>