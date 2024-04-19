<script lang="ts" setup>

</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <com-navigation></com-navigation>
    <section>
      <div class="container">
        <div class="flex__center introduction">
          <div class="fs48 text-right">
            <p>嗨,</p>
            <p class="my1">我是<span class="font-bold fs60">郑洋</span></p>
            <p class="fs24">前端开发工程师</p>
          </div>
          <div class="section__avatar">
            <div class="avatar__box mx-auto">
              <img src="" alt="avatar" />
            </div>
          </div>
          <div>
            <p class="fs18">介绍</p>
            <p class="detail fs24 my2">
              专注于使用<span class="font-bold">Vuejs</span>进行中后台系统
              开发、组件二次封装、<span class="font-bold">SSR</span>网站
              前端开发等等...
            </p>
            <com-button suffix-icon="profilearrow" link><span class="fs18">了解更多</span></com-button>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>
.introduction {
  height: 1006px;
}

.section__avatar {
  max-width: 503px;
  width: 100%;
}

.avatar__box {
  width: 363px;
  height: 363px;
}

.avatar__box img {
  max-width: 100%;
  max-height: 100%;
}

.detail {
  max-width: 350px;
  width: 100%;
}
</style>
