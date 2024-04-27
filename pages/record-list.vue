<script lang="ts" setup>
useHead({
  title: "个人纪录"
});

const searchVal = ref('');

const blogList = ref([
  {
    title: '标题',
    describe: `内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容`,
    imageUrl: '/images/pd3.png',
    view: 0,
    collection: 0,
    like: 0,
    tread: 0,
    isLike: false,
    isTread: false,
    isCollection: false,
  },
  {
    title: '标题',
    describe: `内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容`,
    imageUrl: '/images/pd3.png',
    view: 0,
    collection: 0,
    like: 0,
    tread: 0,
    isLike: true,
    isTread: true,
    isCollection: true,
  },
  {
    title: '标题',
    describe: `内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容`,
    imageUrl: '/images/pd3.png',
    view: 0,
    collection: 0,
    like: 0,
    tread: 0,
    isLike: false,
    isTread: false,
    isCollection: false,
  }
]);

const rank = ref([
  {
    name: '排行第一',
    fontSize: 36,
    isBold: true
  },
  {
    name: '排行第二',
    fontSize: 30,
    isBold: true
  },
  {
    name: '排行第三',
    fontSize: 26,
    isBold: true
  },
  {
    name: '排行第四',
    fontSize: 24,
    isBold: false
  },
  {
    name: '排行第五',
    fontSize: 24,
    isBold: false
  },
]);
</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="false"
  >
    <com-navigation></com-navigation>
    <div class="search">
      <div class="w100 flex__center search__box">
        <com-form-input
          class="search__input"
          type="search"
          v-model="searchVal" 
          :is-label="false"
          :width="1000"
        >
          <template #prepend>
            <com-icon class="ml2 search__icon" icon="profilesign-in">
            </com-icon>
          </template>
          <template #append>
            <com-button class="search__btn mr2" plain is-ripple>
              <span class="fs20" style="pointer-events: none;">搜索</span>
            </com-button>
          </template>
        </com-form-input>
      </div>
    </div>
    <section class="pb5">
      <div class="container">
        <div class="flex content">
          <div class="blog">
            <div 
              v-for="(item, index) in blogList" 
              :key="index"
              class="blog__item flex__column mb2"
            >
              <div class="mb1">
                <p class="fs22">{{ item.title }}</p>
              </div>
              <div class="flex flex1">
                <div class="flex flex1">
                  <div class="blog__content__box h100">
                    <div class="describe__box flex__column--between">
                      <p class="fs22 describe">{{ item.describe }}</p>
                      <div class="flex__row--end flex-nowrap mt1">
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="icon__gap" 
                            icon="profilesee">
                          </com-icon>
                          {{ item.view }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="icon__gap" 
                            :icon="item.isLike 
                              ? 'profilelike-active' 
                              : 'profilelike1'
                            "
                          ></com-icon>
                          {{ item.like }}
                        </span>
                        <span class="mr1 flex__row">
                          <com-icon 
                            class="direction--reversal icon__gap" 
                            :icon="item.isTread 
                              ? 'profilelike-active' 
                              : 'profilelike1'"
                          ></com-icon>
                          {{ item.tread }}
                        </span>
                        <span class="flex__row">
                          <com-icon 
                            class="icon__gap" 
                            :icon="item.isCollection 
                              ? 'profilecollection-active' 
                              : 'profilecollection'"
                          ></com-icon>
                          {{ item.collection }}
                        </span>
                      </div>
                    </div>
                    <div class="thumbnail">
                      <img :src="item.imageUrl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <com-pagination></com-pagination>
          </div>
          <div class="rank">
            <p class="font-bold fs30">点击排行榜</p>
            <div>
              <div v-for="(item, index) in rank" 
                :key="index"
                class="rank__item"
                :class="`fs${item.fontSize} 
                ${(item.isBold ? 'font-bold' : '')}`"
              >
                <span 
                  :class="[
                    `rank__item-${index+1}`, 
                    {
                      'rank__special': index < 3
                    }
                  ]"
                  class="mr1"
                >
                  {{ index + 1 }}
                </span>
                <span style="display: inline-block">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </NuxtLayout>
</template>
<style scoped>
.search {
  height: 250px;
  background-color: var(--white-color);
  border-bottom: 1px solid var(--primary-border-color);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.search__box {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.search__icon {
  width: 46px;
  height: 50px;
}

.search__btn {
  width: 120px;
  height: 60px;
}

:deep(.search__input.form__input-box) {
  height: 113px;
  border-width: 3px;
  border-radius: 55px;
}

:deep(.search__input .form__input-field) {
  height: 100%;
  border-radius: 55px;
}

.content {
  margin-top: 200px;
  margin-left: -27px;
  margin-right: -27px;
}

.blog {
  max-width: 1000px;
  flex: 2 1 100%;
  margin: 0 27px;
}

.blog__item {
  cursor: pointer;
  border-radius: 20px;
  min-height: 320px;
  max-width: 1000px;
  width: 100%;
  background: var(--white-color);
  padding: 32px;
  box-shadow: 0px 12px 15px 0px rgba(0, 0, 0, 0.25);
}

.blog__item:hover {
  
}

.blog__content__box {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0 -12.5px;
}

.describe__box {
  height: 100%;
  max-width: 666px;
  width: 100%;
  margin: 0 12.5px;
}

.describe {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.4;
}

.thumbnail {
  max-width: 243px;
  width: 100%;
  height: 100%;
  margin: 0 12.5px;
}

.thumbnail img {
  width: 100%;
}

.icon__gap {
  margin-right: 5px;
}

.rank {
  max-width: 447px;
  height: 782px;
  height: 100%;
  flex: 1 1 100%;
  margin: 0 27px;
  background: var(--white-color);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0px 12px 15px 0px rgba(0, 0, 0, 0.25);
}

.rank__item {
  padding: 18px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;
}

.rank__item:not(:last-child) {
  border-bottom: 1px dashed var(--primary-border-color);
}

span[class^="rank__item-"] {
  display: inline-block;
  text-align: center;
}

.rank__special {
  border: 1px solid var(--primary-border-color);
  border-radius: 10px;
}

.rank__item-1 {
  width: 62px;
  height: 62px;
  line-height: 62px;
}

.rank__item-2 {
  width: 54px;
  height: 54px;
  line-height: 54px;
}

.rank__item-3 {
  width: 44px;
  height: 44px;
  line-height: 44px;
}

span[class^="rank__item-"]:not(.rank__special) {
  width: 34px;
  height: 34px;
  line-height: 34px;
}
</style>