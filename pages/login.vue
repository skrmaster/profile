<script lang="ts" setup>
useHead({
  title: "登录"
})

const name = ref('');

</script>
<template>
  <NuxtLayout 
    name="background-setting" 
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
    class="flex__center"
  >
    <div class="login-box">
      <div class="notice-box">
        <div class="notic-box--resize">
          <p>我认帐，但是老子不给！嘻嘻...老子不给！不给！</p>
        </div>
      </div>
      <div class="input-box">
        <com-form-input 
          v-model="name"
          placeholder="请输入邮箱" 
          clearable
        >
        </com-form-input>
        <com-button>123</com-button>
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>

.login-box {
  margin: 0 0.25rem;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  width: 1411px;
  height: 867px;
  border-top: 16px solid var(--primary-border-color);
  background-size: 10px 10px;
  background-image: radial-gradient(circle at center, #ebebeb 10%, transparent 20%);
  overflow: hidden;
  padding: 0.4rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.notice-box {
  flex: 1 1 0;
  font-size: 28px;
  margin-right: 0.2rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: start;
  justify-content: center;
  /* margin-bottom: 1rem; */
}

.notic-box--resize {
  max-width: 450px;
  height: 100%;
}

.input-box {
  border-width: 2px;
  border-color: #eeeeee;
  border-style: solid;
  border-radius: 10px;
  background-color: #ffffff;
  width: 499px;
  height: 564px;
}
</style> 