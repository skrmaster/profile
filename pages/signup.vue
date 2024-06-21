<script lang="ts" setup>
import textdata from 'assets/json/constellation.json';
import { apiGetRandom } from '@/api/aphorisms/request';
import md5 from 'md5';
import { apiRegister, apiUpdateUserInfo, apiSendMail } from '~/api/user/request'
import type { Register, UpdatePwd } from '~/api/user/model';
import type { StorageSuger as StorageSugerType } from '#imports';

const url = import.meta.env.VITE_PROJECT_OUTSIDE_ENGINE;
const dayjs = useDayjs();
const themeState = useState('theme', () => 'light');
let storage: StorageSugerType;

const { $message } = useNuxtApp();

useHead({
  title: "注册"
});
const route = useRoute();
const form = ref();
const btnLoading = ref(false);
const textArray = textdata.data;
const speech = ref<string | undefined>();
const from = ref<string | undefined>();
const dayDate = new DayDate();
let deg = 0;
let canvasAnimateSwitch = true;
const currentTimeRotateDeg = getRotateDeg();
const emailId = ref('');

const config = ref<Array<FormConfig>>([]);
const isFinished = ref(false);

const registerConfig: Array<FormConfig> = [
  {
    require: true,
    field: 'account',
    type: 'text',
    rule: 'account',
    elementConfig: {
      width: '100%',
      placeholder: '请输入账号',
      clearable: true,
      errorMsg: '请输2~8个字符'
    }
  },
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
]

const forgetPwdConfig: Array<FormConfig> = [
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
      placeholder: '请输入新密码',
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
]

const isForget = computed(() => {
  return route.query && route.query.type && route.query.type === 'forget';
});

watchEffect(() => {
  if (isForget.value) {
    config.value = forgetPwdConfig;
  } else {
    config.value = registerConfig;
  }
});

init();
function init() {
  getRandomAphorisms();
}

function getRandomAphorisms() {
  apiGetRandom().then(res => {
    speech.value = res.data.content;
    from.value = res.data.from;
  }).catch(e => {

  });
}

let time = 3;//秒
let timer: ReturnType<typeof setTimeout>;
function wheelSetTimeout(updateCallback: (...args: any) => any, resultCallback: (...args: any) => any) {
  timer = setTimeout(() => {
    time--;
    if (updateCallback) {
      updateCallback();
    }
    wheelSetTimeout(updateCallback, resultCallback);
    if (time === 0) {
      clearTimeout(timer);
      if (resultCallback) {
        setTimeout(resultCallback, 1000);
      }
    }
  }, 1000);
}

function drawClock() {
  const canvas = document.getElementById('login-canvas') as HTMLCanvasElement;
  if (!canvas) {
    drawClock();
    return;
  }
  const w_canvas = canvas.width;
  const h_canvas = canvas.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    drawClock();
    return;
  }

  ctx.clearRect(0, 0, w_canvas, h_canvas);
  ctx.save();
  ctx.translate(0, 500);
  ctx.scale(2, 2);
  ctx.save();
    if (deg < currentTimeRotateDeg) {
      ctx.rotate(-(deg * Math.PI / 180));
    } else {
      ctx.rotate(-(deg * Math.PI / 180));
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
          //字号
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
  const res = (currentDay - point) * oneOfDeg;
  return res;
}

function getTodayNumber(): number {
  const currentDate = dayjs();
  const formattedDate = currentDate.format('M.D');

  return DayDate.numberPointNumberOfMonth(formattedDate, 
    DayDate.monthMap(dayDate.yearDayCount()));
}

function handleSubmit() {
  btnLoading.value = true;
  if (form.value) {
    form.value.vaildForm()
    .then((val: ReturnVaildForm) => {
      if (val.vaild) {
        const localStorage = new StorageSuger("localStorage");
        if (!isForget.value) {
          const params: Register = {
            account: val.data.account,
            email: val.data.email,
            password: md5(import.meta.env.VITE_PROJECT_SALT + val.data.password),
            code: val.data.code,
            codeId: emailId.value
          }

          if (!params.codeId) {
            const codeId = localStorage.getValue('CodeId') as string;
            params.codeId = codeId ? JSON.parse(codeId) : undefined;
          }

          apiRegister(params).then(res => {
            isFinished.value = true;
            authComplete(res, '注册成功');
          }).catch(e => {
            btnLoading.value = false;
            isFinished.value = false;
          }); 
        } else {
          const params: UpdatePwd = {
            email: val.data.email,
            password: md5(import.meta.env.VITE_PROJECT_SALT + val.data.password),
            code: val.data.code,
            codeId: emailId.value
          }

          if (!params.codeId) {
            params.codeId = localStorage.getValue('CodeId') as string;
          }

          apiUpdateUserInfo(params).then(res => {
            isFinished.value = true;
            authComplete(res, '修改成功');
          }).catch(e => {
            btnLoading.value = false;
            isFinished.value = false;
          });
        }
      } else {
        btnLoading.value = false;
      }
    });
  }
}

function handleSendMail(data: Record<string, string>) {
  if (!data.email) {
    $message.show({
      message: '需要邮箱',
      type: 'error'
    });
    return;
  }

  apiSendMail(data.email).then(res => {
    if (res.succeeded) {
      emailId.value = res.data;
      const localStorage = new StorageSuger("localStorage");
      localStorage.setValue("CodeId", res.data);
      $message.show({
        message: '邮件已发送注意查看',
        type: 'success'
      });
    } else{
      $message.show({
        message: res.data || res.errors,
        type: 'error'
      })
    }
  }).catch(e => {});
}

function authComplete(res: ResponseModel<string | boolean>, resInfo: string) {
  btnLoading.value = false;
  if (res.succeeded) {
    $message.show({
      message: resInfo,
      type: 'success'
    });
    wheelSetTimeout(() => {
      $message.show({message: `${time}秒后，自动跳转到登录页`, type: 'success'})
    }, () => {
      navigateTo('/login');
      isFinished.value = false;
    });
  } else {    
    $message.show({
      message: res.data?.toString() || (typeof res.errors !== 'string' ? JSON.stringify(res.errors) : res.errors),
      type: 'error'
    });
    isFinished.value = false;
  }
}

onNuxtReady(() => {
  drawClock();

  storage = new StorageSuger('localStorage');
  const themeString = storage.getValue('theme') as string;
  const currentTheme = themeString ? JSON.parse(themeString) : '';

  if (currentTheme === 'dark') {
    setTheme('dark');
    themeState.value = 'dark';
  } else {
    setTheme('light');    
    themeState.value = 'light';
  }
});

</script>
<template>
  <com-background
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <div class="container flex__center">
      <div class="login-box row">
        <NuxtLink class="gohome c-p underline" to="/">
          <com-icon icon="profile-home1"></com-icon>
        </NuxtLink>
        <div class="notice-box p1 z-index9">
          <div class="notic-box--resize">
            <a 
              :href="`${url}/search?q=${speech}`" 
              target="_blank"
            >{{ speech }}</a>
            <p class="mt1 fs14 text-right">{{ from ? `--${from}` : '' }}</p>
          </div>
        </div>
        <div class="p1 flex1 z-index9">
          <div class="input-box mx-auto">
            <div class="register-icon flex__center">
              <com-icon
                width="56px"
                height="53px"
                class="sign-up--icon"
                :icon="isForget ? 'profile-mima' : 'profile-signup'"
              ></com-icon>
            </div>
            <com-form v-if="!isFinished" ref="form" :model="config" @send-mail-code="handleSendMail">
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
            <com-empty v-else :info="'等待...'"></com-empty>
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
  </com-background>
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
  background-image: var(--login-box-bg);
  overflow: hidden auto;
  align-items: center;
  position: relative;
}

.gohome {
  position: absolute;
  top: 0;
  left: 5px;
  z-index: 999;
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
  border-color: var(--login-box-border-color);
  border-style: solid;
  border-radius: 10px;
  background-color: var(--white-color);
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
  z-index: 0;
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