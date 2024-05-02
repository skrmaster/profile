<script lang="ts" setup>
useHead({
  title: "个人中心"
});

</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <section>
      <div class="container">
        <div class="flex__row">
          <aside class="flex__center mr1">
            <div class="flex__column--center">
              <com-avatar nickname="头像" ></com-avatar>
              <div class="flex__row--between mt1">
                <span class="mr1">关注: 0</span>
                <span>粉丝: 0</span>
              </div>
            </div>
          </aside>
          <main class="flex__column">
            <div>
              <com-avatar nickname="头像"></com-avatar>
            </div>
          </main>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
<style scoped>
section {
  padding: 10px 0;
}

aside {
  max-width: 375px;
  width: 100%;
  height: 100%;
  background: var(--white-color);
  border-radius: 10px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
}

main {
  flex: 1;
  border-radius: 10px;
  background: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  padding: 10px;
}
</style>