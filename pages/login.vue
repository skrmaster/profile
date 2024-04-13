<script lang="ts" setup>
import textdata from 'assets/json/text-path.json';

useHead({
  title: "登录"
})
const textArray = textdata.data;

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

function drawClock() {
  const canvas = document.getElementById('login-canvas') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return;
  }
  
  ctx.save();
  ctx.translate(150, 150);
  ctx.beginPath();
  ctx.strokeStyle = "color: black";
  ctx.arc(0, 0, 140, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.restore();

  
  ctx.save();
  ctx.translate(150, 150);
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.rotate(Math.PI / 6 * i);
    ctx.translate(0, -128);
    ctx.beginPath();
    ctx.scale(2, 2);
    const tmp: Record<string, Path2D> = {};
    textArray[i].forEach((e: string, i: number) => {
      tmp[`p${i}`] = new Path2D(e);
    });
    
    const p = new Path2D();
    for (const key in tmp) {
      p.addPath(tmp[key]);
    }
    
    ctx.fill(p);
    ctx.restore();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(150, 150);
  ctx.beginPath();
  ctx.strokeStyle = "color: black";
  ctx.arc(0, 0, 100, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.restore();
}

onNuxtReady(() => {
  drawClock();
})

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
        <div class="notice-box p1 z-index9">
          <div class="notic-box--resize">
            <a 
              :href="`https://cn.bing.com/search?q=${speech}`" 
              target="_blank"
            >{{ speech }}</a>
          </div>
        </div>
        <div class="p1 flex1 z-index9">
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
        <canvas viewBox="0 0 8.5 6.71" id="login-canvas" width="300" height="300" class="clock"></canvas>
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
  position: relative;
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


.clock {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style> 