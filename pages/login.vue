<script lang="ts" setup>
useHead({
  title: "登录"
})

const speech = ref('我认帐，但是老子不给！嘻嘻...老子不给！不给！')

const config: Array<FormConfig> = [
  {
    require: true,
    field: 'name',
    type: 'text',
    rule: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入邮箱',
      clearable: true
    }
  },
  {
    require: true,
    field: 'password',
    type: 'password',
    rule: '',
    elementConfig: {
      width: '100%',
      placeholder: '请输入密码',
      clearable: false
    }
  },
  {
    require: true,
    field: 'code',
    type: 'verification-code',
    rule: '',
    elementConfig: {
      placeholder: '请输入验证码'
    }
  }
]

</script>
<template>
  <NuxtLayout 
    name="background-setting" 
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <div class="container flex__center">
      <div class="login-box row">
        <div class="notice-box p1">
        <div class="notic-box--resize">
          <a :href="`https://cn.bing.com/search?q=${speech}`" target="_blank">{{ speech }}</a>
        </div>
      </div>
      <div class="p1 flex1">
        <div class="input-box mx-auto">
          <div class="register-icon flex__center">
            <com-icon
              class="sign-up--icon"
              icon="profilesign-up"
            ></com-icon>
          </div>
          <com-form :model="config">
            <com-button class="action-btn fs24">注册</com-button>
          </com-form>
        </div>
      </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>

.login-box {
  max-width: 1411px;
  max-height: 867px;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  border-top: 16px solid var(--primary-border-color);
  background-size: 10px 10px;
  background-image: radial-gradient(circle at center, #ebebeb 10%, transparent 20%);
  overflow: hidden;
  align-items: center;
}

.notice-box {
  flex: 1;
  font-size: 26px;
  display: flex;
  flex-flow: row nowrap;
  align-items: start;
  justify-content: center;
}

.notic-box--resize {
  max-width: 300px;
  width: 100%;
  min-width: 200px;
  height: 100%;
}

.input-box {
  border-width: 2px;
  border-color: #eeeeee;
  border-style: solid;
  border-radius: 10px;
  background-color: #ffffff;
  max-width: 430px;
  width: 100%;
  min-width: 300px;
  position: relative;
  padding: 100px 30px 50px 30px;
}

.register-icon {
  width: 100px;
  height: 100px;
  border: 1px solid var(--primary-border-color);
  border-radius: 50%;
  background-color: var(--white-color);
  position: absolute;
  top: -50px;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, 0);
}

.sign-up--icon {
  width: 60px;
  height: 60px;
  cursor: auto;
}

.action-btn {
  width: 100%;
  height: 66px;
}
</style> 