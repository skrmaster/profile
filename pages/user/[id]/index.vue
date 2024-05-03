<script lang="ts" setup>
type LinkType = {
  name: string;
  url: string;
}

useHead({
  title: "个人中心"
});

const route = useRoute();
const params = route.params;
const list = ref<LinkType[][]>([
  [
    {
      name: '账号信息',
      url: '/user/:id',
    },
    {
      name: '关注的人',
      url: '/user/:id/follow'
    }
  ],
  [
    {
      name: '博客列表',
      url: '/user/:id/record-list'
    },
    {
      name: '项目列表',
      url: '/user/:id/project-list'
    }
  ]
]);
const formData = reactive({
  nickName: '123',
  email: 'zyskr@qq.com',
  code: ''
});

function isCurrentRoute(item: string) {
  let fullPath = route.fullPath;
  item = item.replace(':id', params.id as string);

  return item === fullPath;
}

function handleJump(item: LinkType) {
  item.url = item.url.replace(':id', params.id as string);
  navigateTo(item.url, { replace: true });
}

</script>
<template>
  <div class="background flex__column">
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <section class="flex__column flex1">
      <div class="container flex__column flex1">
        <div class="row flex1">
          <aside class="mr1">
            <div class="flex__column--center">
              <com-avatar nickname="头像" ></com-avatar>
              <div class="flex__row--between mt1">
                <span class="mr1">关注: 0</span>
                <span>粉丝: 0</span>
              </div>
            </div>
            <div class="mt2">
              <div v-for="(item, index) in list" :key="index"
                class="mb2"
              >
                <div class="flex1 flex__column--center">
                  <div 
                    v-for="(e, i) in item" 
                    :key="i" 
                    class="nav__item flex__center flex1"
                    :class="{
                      'is--active': isCurrentRoute(e.url)
                    }"
                    @click="handleJump(e)"
                  >
                    <span class="link__name">{{ e.name }}</span>
                    <com-icon class="link__icon" icon="profileleft"></com-icon>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <main class="flex__column">
            <div class="main__content flex__column">
              <div class="form__item">
                <label class="label">头像</label>
                <com-upload 
                  label="上传头像"
                  :limit="1"
                  class="form__item-avatar"
                ></com-upload>
              </div>
              <div class="form__item">
                <label class="label">昵称</label>
                <com-form-input 
                  class="form__item-content" 
                  :is-label="false" 
                  clearable
                  v-model="formData.nickName"
                ></com-form-input>
              </div>
              <div class="form__item">
                <label class="label">邮箱</label>
                <com-form-input 
                  class="form__item-content" 
                  :is-label="false" 
                  clearable
                  v-model="formData.email"
                ></com-form-input>
              </div>
              <div class="form__item">
                <label class="label"></label>
                <com-form-verification-code 
                  class="form__item-content"
                  :is-label="false" 
                  v-model="formData.code"
                ></com-form-verification-code>
              </div>
              <div class="form__item">
                <label class="label"></label>
                <com-button style="width: 100px">
                  <span>保存</span>
                </com-button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
    <com-footer></com-footer>
  </div>
</template>
<style scoped>
.background {
  background-image: radial-gradient(#ffffff 0, var(--background-color) 100%);
  background-blend-mode: screen;
  max-width: 100vw;
  width: 100%;
  min-height: 100vh;
}

section {
  padding: 10px 0;
}

aside {
  max-width: 375px;
  width: 100%;
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
}

main {
  flex: 1;
}

.main__content {
  background: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 20px 16px;
}

.link__name {
  font-size: 18px;
}

.link__icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform-origin: center center;
  transform: translateY(-50%) rotate(180deg);
}

.nav__item {
  width: 100%;
  position: relative;
  padding: 3px;
}

.nav__item:hover {
  cursor: pointer;
  border-radius: 10px;
  background-color: var(--nav-link-hover);
}

.nav__item.is--active {
  border-radius: 10px;
  background-color: var(--nav-link-bg);
}

.form__item {
  margin: 0 0 20px 0;
  display: flex;
  flex-direction: row;
}

.form__item-avatar {
  width: 150px;
  height: 150px;
}

.label {
  max-width: 50px;
  width: 100%;
}

.form__item-content {
  max-width: 400px!important;
  width: 100%;
  outline: 0;
  border-radius: 10px;
  
}

.form__item-content:not(.verification) {
  background: var(--readonly-color);
}

:deep(.form__item-content .form__input-field) {
  border-radius: 10px;
  background: var(--readonly-color);
}

:deep(.form__item-content .form__input-box) {
  border-radius: 10px;
  outline: 0;
}
</style>