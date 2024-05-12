<script lang="ts" setup>
import textdata from 'assets/json/constellation.json';
import md5 from 'md5';
import { apiRegister } from '~/api/user/request'
import type { registerType } from '~/api/user/userModel';

const url = import.meta.env.VITE_PROJECT_OUTSIDE_ENGINE;
const dayjs = useDayjs();

useHead({
  title: "登录"
});
const route = useRoute();
const form = ref();
const textArray = textdata.data;
const speech = ref('我认帐，但是老子不给！嘻嘻...老子不给！不给！');
const dayDate = new DayDate();
let deg = 0;
let canvasAnimateSwitch = true;
const currentTimeRotateDeg = getRotateDeg();
const config: Array<FormConfig> = [
  {
    require: true,
    field: 'email',
    type: 'text',
    rule: 'email',
    elementConfig: {
      width: '100%',
      placeholder: '请输入邮箱',
      clearable: true,
      errorMsg: '请输入正确的邮箱格式'
    }
  },
  {
    require: true,
    field: 'password',
    type: 'password',
    rule: 'password',
    elementConfig: {
      width: '100%',
      placeholder: '请输入密码',
      clearable: false,
      errorMsg: '请输入8~16位数字,大小写字母的密码'
    }
  },
  {
    require: true,
    field: 'code',
    type: 'verification-code',
    rule: 'numberCode',
    elementConfig: {
      placeholder: '请输入验证码',
      errorMsg: '请输入6位数字验证码'
    }
  }
];

const isForget = computed(() => {
  return route.query && route.query.type && route.query.type === 'forget';
})

function drawClock() {
  const canvas = document.getElementById('login-canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('canvas element is null!');
  }
  const w_canvas = canvas.width;
  const h_canvas = canvas.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('canvas context is null!');
  }

  ctx.clearRect(0, 0, w_canvas, h_canvas);
  ctx.save();
  ctx.translate(0, 500);
  ctx.scale(2, 2);
  ctx.save();
    if (deg < currentTimeRotateDeg) {
      ctx.rotate((deg * Math.PI / 180));
    } else {
      ctx.rotate((deg * Math.PI / 180));
      canvasAnimateSwitch = false;
    }
    ctx.rotate(-(Math.PI / 60));
    ctx.save();
      ctx.strokeStyle = "color: black";

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.arc(0, 0, 158, 0, 2 * Math.PI, true);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.arc(0, 0, 122, 0, 2 * Math.PI, true);
      ctx.stroke();

      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        ctx.save();
          ctx.rotate(Math.PI / 6 * i);
          ctx.translate(0, -145);
          ctx.beginPath();
          ctx.scale(1.5, 1.5);
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
  ctx.restore();

  //指针圆环
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.closePath();

  //指针
  ctx.rotate(Math.PI / 4);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(0, -125);
  ctx.stroke();
    
  ctx.beginPath();
  ctx.moveTo(5, -125);
  ctx.lineTo(-5, -125);
  ctx.lineTo(0, -133);
  ctx.fill();

  
  if (!canvasAnimateSwitch) {
    return;
  } else {
    ctx.restore();
    deg++;
  }
  
  window.requestAnimationFrame(drawClock);
}

function getRotateDeg(): number {
  const year = dayDate.yearDayCount();
  const oneOfDeg = Math.ceil(360 / year);
  const point = DayDate.numberPointNumberOfMonth('3.21', 
    DayDate.monthMap(dayDate.yearDayCount()));
  const currentDay = getTodayNumber();
  return (currentDay - point) * oneOfDeg;
}

function getTodayNumber(): number {
  const currentDate = dayjs();
  const formattedDate = currentDate.format('M.D');

  return DayDate.numberPointNumberOfMonth(formattedDate, 
    DayDate.monthMap(dayDate.yearDayCount()));
}

function handleSubmit() {
  if (form.value) {
    form.value.vaildForm()
    .then(async (val: ReturnVaildForm) => {
      if (val.vaild) {
        const params: registerType = {
          email: '',
          password: md5(import.meta.env.VITE_PROJECT_SALT + val.data.password),
          code: ''
        }
        await apiRegister(params).then(res => {
          if (res) {
            navigateTo('/login');
          }
        }); 
      }
    });
  }
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
              :href="`${url}/search?q=${speech}`" 
              target="_blank"
            >{{ speech }}</a>
          </div>
        </div>
        <div class="p1 flex1 z-index9">
          <div class="input-box mx-auto">
            <div class="register-icon flex__center">
              <com-icon
                width="56px"
                height="53px"
                class="sign-up--icon"
                :icon="isForget ? 'profilemima' : 'profilesign-up'"
              ></com-icon>
            </div>
            <com-form ref="form" :model="config">
              <div class="w100 mb2">
                <NuxtLink 
                  to="/login" 
                  class="fs12 underline"
                >{{ isForget ? '👌记起密码，前往登录' : '👍已有帐号，前往登录' }}</NuxtLink>
              </div>
              <com-button 
                class="action-btn fs24"
                @click="handleSubmit"
              >{{ isForget ? '找回密码' : '注册' }}</com-button>
            </com-form>
          </div>
        </div>
        <canvas 
          id="login-canvas" 
          width="500" 
          height="500" 
          class="clock"
        ></canvas>
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
  background-image: 
    radial-gradient(circle at center, #ebebeb 10%, transparent 20%);
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