<script lang="ts" setup>
import PersonalCenter from './components/personal-center.vue';
import { apiUpdateUserInfo, apiUserLogout, apiSendMail, apiCheckMailUsed } from '~/api/user/request';
import { apiAdd as fileApiAdd } from '~/api/upload/request';
import type { UserModel, UpdateInfo } from '~/api/user/model';
import type { AddModel as FileAddModel  } from '~/api/upload/model';
import md5 from 'md5';

const userInfo = useState<UserModel | undefined>("userInfo");
const userInfoCache = computed(() => userInfo.value);
const formData = reactive<UpdateInfo>({
  account: '',
  email: '',
  password: '',
  originEmail: '',
  code: '',
  codeId: ''
});
const { $message } = useNuxtApp();
const images = ref<Upload.FileInfo[]>([]);
const fileList = ref<Array<Upload.FileInfo>>([]);
const canUpload = ref(false);
const UploadRef = ref();
const btnLoading = ref(false);
const verifyRef = ref();
const error = reactive<Record<string, boolean>>({
  verify: false,
  email: false,
  password: false
});

async function handleFileUpload(list: Array<Upload.FileInfo | File>) {
  for await (let item of list) {
    if (!isFile(item)) {
      continue;
    }

    const params: FileAddModel = {
      category: 0,
      file: item
    }
    fileApiAdd(params).then(res => {
      images.value.push(res.data)
    }).catch(() => {});
  }
}

function handleUpdate() {
  const params: UpdateInfo = {
    ...formData,
    avatar: JSON.stringify(images.value[0]) || userInfo.value?.avatar
  }

  if (!params.codeId) {
    const localStorage = new StorageSuger("localStorage");
    const codeId = localStorage.getValue('UserInfoCodeId') as string;
    params.codeId = codeId ? JSON.parse(codeId) : undefined;
  }

  if (!vaildTest(formData.password, 'password')[0]) {
    error.password = true;
    $message.show({
      message: '填写密码并且是8~16位包含数字,大小写字母的密码',
      type: 'error'
    });
  }

  if (!formData.code || !vaildTest(formData.code, 'numberCode')[0]) {
    error.verify = true;
  }

  if (Object.values(error).includes(true)) {
    setTimeout(() => {
      for (let key in error) {
        error[key] = false;
      }
    }, 2000);
    return;
  }
  
  params.password = md5(import.meta.env.VITE_PROJECT_SALT + params.password);

  btnLoading.value = true;
  apiUpdateUserInfo(params).then((res) => {
    btnLoading.value = false;
    if (res.succeeded) {
      $message.show({
        message: '操作成功',
        type: 'success'
      });
      location.reload();
    } else {
      $message.show({
        message: res.data.toString() || res.errors,
        type: 'error'
      });
    }
  }).catch(e => {
    btnLoading.value = false;
  });
}

hasUploadAuth();
async function hasUploadAuth() {
  const resultUserInfo = await useUserInfo();
  if (resultUserInfo) {
    userInfo.value = resultUserInfo;
  }
  
  if (userInfo.value) {
    canUpload.value = userInfo.value.permission?.includes('1') ?? false;
    nextTick(() => {
      const imageIds: Upload.FileInfo = userInfo.value?.avatar ? JSON.parse(userInfo.value?.avatar) : [];
      fileList.value = [imageIds].map(e => {
        return {
          id: e.id,
          fullPath: splicingImageUrl(e.fullPath) || ""
        }
      });
    });
  } else {
    canUpload.value = false;
  }
}

function handleCheckEmail() {
  const result = vaildTest(formData.email, 'email');
  if (!result[0]) {
    return;
  }

  apiCheckMailUsed(formData.email).then(res => {
    if (res.data) {
      $message.show({
        message: '该邮箱已被使用',
        type: 'warning'
      });
    }
  }).catch(e => {});
}

function getUserInfo() {  
  formData.account = userInfo.value?.account || '';
  formData.originEmail = userInfo.value?.email || '';
  formData.avatar = userInfo.value?.avatar;
}

function handleLoginout() {
  apiUserLogout().then(async (res) => {
    if (res.succeeded) {
      const localStorage = new StorageSuger("localStorage");
      const sectionStorage = new StorageSuger("sessionStorage");
      localStorage.clearAll();
      sectionStorage.clearAll();

      await navigateTo('/');
      location.reload();
    }
  }).catch(e => {})
}

function handleSendMail() {
  if (!formData.email) {
    if (!formData.originEmail) {
      $message.show({
        message: '需要填写新邮箱',
        type: 'warning'
      });
      verifyRef.value?.clearTimeCount();
      return;
    }
  }
  apiSendMail(formData.email || formData.originEmail).then(res => {
    if (res.succeeded) {
      const localStorage = new StorageSuger("localStorage");
      localStorage.setValue("UserInfoCodeId", res.data);
      formData.codeId = res.data;
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

onNuxtReady(() => {
  getUserInfo();
});
</script>
<template>
<personal-center>
  <div class="main__content flex__column">
    <div class="form__item" v-if="canUpload">
      <label class="label">头像</label>
      <com-upload 
        ref="UploadRef"
        label="上传头像"
        :data-list="fileList"
        :limit="1"
        @file-monuted="handleFileUpload"
        class="form__item-avatar"
      ></com-upload>
    </div>
    <div class="form__item">
      <label class="label">昵称</label>
      <com-form-input 
        class="form__item-content" 
        :is-label="false" 
        clearable
        v-model="formData.account"
      ></com-form-input>
    </div>
    <div class="form__item">
      <label class="label">原邮箱</label>
      <com-form-input 
        class="form__item-content" 
        :is-label="false" 
        disabled
        placeholder="请输入原邮箱"
        clearable
        v-model="formData.originEmail"
      ></com-form-input>
    </div>
    <div class="form__item">
      <label class="label">新邮箱</label>
      <com-form-input 
        class="form__item-content" 
        :is-label="false" 
        @blur="handleCheckEmail"
        clearable
        placeholder="请输入新邮箱"
        v-model="formData.email"
      ></com-form-input>
    </div>
    <div class="form__item">
      <label class="label">密码</label>
      <com-form-input 
        class="form__item-content" 
        :is-label="false"
        placeholder="请输入账号密码"
        :is-error="error.password"
        clearable
        v-model="formData.password"
        type="password"
      ></com-form-input>
    </div>
    <div class="form__item">
      <label class="label"></label>
      <com-form-verification-code 
        ref="verifyRef"
        :is-error="error.verify"
        class="form__item-content"
        :is-label="false" 
        v-model="formData.code"
        @send-mail="handleSendMail"
      ></com-form-verification-code>
    </div>
    <div class="form__item flex__row">
      <label class="label"></label>
      <com-button :loading="btnLoading" style="width: 100px" @click.stop="handleUpdate">
        <span>保存</span>
      </com-button>
      <com-button class="ml1" style="width: 80px; height: 40px" plain @click.stop="handleLoginout">
        <span>登出</span>
      </com-button>
    </div>
  </div>
</personal-center>
</template>
<style scoped>
.main__content {
  background: var(--white-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 20px 16px;
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
  max-width: 70px;
  width: 100%;
}

.form__item-content {
  max-width: 400px!important;
  width: 100%;
  outline: 0;
  border-radius: 10px;
}

.form__item-content:not(.verification) {
  background: var(--user-input-bg);
}

:deep(.form__item-content .form__input-field) {
  border-radius: 10px;
  background: var(--user-input-bg);
}

:deep(.form__item-content .form__input-box) {
  border-radius: 10px;
  outline: 0;
  background: var(--user-input-bg);
}
</style>