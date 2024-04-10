<script lang="ts" setup>
useHead({
  title: "登录"
})

const config: Array<FormConfig> = [
  {
    require: true,
    field: 'name',
    type: 'text',
    rule: '',
    elementConfig: {
      width: '368px',
      placeholder: '请输入邮箱'
    }
  },
  {
    require: true,
    field: 'password',
    type: 'password',
    rule: '',
    elementConfig: {
      width: '368px',
      placeholder: '请输入密码'
    }
  },
  {
    require: true,
    field: 'code',
    type: 'verification-code',
    rule: '',
    elementConfig: {
      width: '227px',
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
    class="flex__center"
  >
    <div class="login-box p80">
      <div class="notice-box">
        <div class="notic-box--resize">
          <p>我认帐，但是老子不给！嘻嘻...老子不给！不给！</p>
        </div>
      </div>
      <div class="input-box pt100">
        <div class="register-icon flex__center">
          <svg 
            class="sign-up--icon"
            aria-hidden="true"
          >
            <use xlink:href="#icon-profilesign-up"></use>
          </svg>
        </div>
        <com-form :model="config">
          <com-button class="mt50">注册</com-button>
        </com-form>
      </div>
    </div>
  </NuxtLayout>
</template>
<style scoped>

.login-box {
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  width: 1411px;
  height: 867px;
  border-top: 16px solid var(--primary-border-color);
  background-size: 10px 10px;
  background-image: radial-gradient(circle at center, #ebebeb 10%, transparent 20%);
  overflow: hidden;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.notice-box {
  flex: 1 1 0;
  font-size: 28px;
  display: flex;
  flex-flow: row nowrap;
  align-items: start;
  justify-content: center;
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
  position: relative;
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
}
</style> 