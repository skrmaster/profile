<script lang="ts" setup>

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
])

function goBack() {

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
        <div>
          <p><label>技术栈</label></p>
          <div>
            <com-tech-stack :data-list="list"></com-tech-stack>
          </div>
        </div>
      </div>
    </section>
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
</style>