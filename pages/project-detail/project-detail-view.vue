<script lang="ts" setup>
import { apiGetInfo } from '~/api/project/request';

type Prop = {
  projectId: string;
}

const props = withDefaults(defineProps<Prop>(), {});
const router = useRouter();
const title = ref('');
const list = ref<StackItem[]>([]);
const imageList = ref<Carousel.ImageList[]>([]);
const detailList = ref([
  {
    label: '概述',
    content: ''
  },
  {
    label: '介绍',
    content: ''
  },
  {
    label: '负责部分',
    content: ''
  }
]);

useHead({
  title
});

init();
function init() {
  apiGetInfo(props.projectId)
  .then(res => {
    title.value = res.data.name;

    detailList.value = ['summary', 'description', 'department'].map((e, i) => {
      const item = {
        label: ['概述', '介绍', '负责部分'][i],
        content: res.data[e]
      }
      return item;
    });

    const stackIds: string[] = res.data.stackIds ? JSON.parse(JSON.parse(res.data.stackIds)) : [];
    
    list.value = stackIds?.map(e => {
      return {
        name: e,
        icon: '',
        officalUrl: '',
        isChoose: false
      }
    });

    const imageIds: string[] = res.data.imageIds ? JSON.parse(JSON.parse(res.data.imageIds)) : [];
    imageList.value = imageIds.map((e, i) => {
      return {
        id: i.toString(),
        image: e.replaceAll('\\', '/')
      }
    });

  }).catch((e) => {
    console.log(e);
  });
}

function goBack() {
  router.back();
}
</script>
<template>
  <com-background 
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
                icon="profile-left"
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
        <com-carousel
          :list="imageList"
        ></com-carousel>
        <div class="stack__box">
          <p><label>技术栈</label></p>
          <div class="my1">
            <com-tech-stack 
              :data-list="list"
              mode="view"
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
  </com-background>
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