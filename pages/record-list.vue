<script lang="ts" setup>
useHead({
  title: "个人纪录"
});

const searchVal = ref('')
</script>
<template>
  <NuxtLayout 
    name="background-setting"
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
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
            <com-button class="search__btn mr2" plain>
              <span class="fs20">搜索</span>
            </com-button>
          </template>
        </com-form-input>
      </div>
    </div>
    <section>

    </section>
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
</style>