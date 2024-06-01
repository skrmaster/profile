<script lang="ts" setup>
import PersonalCenter from './components/personal-center.vue';
import { apiUpdateUserInfo } from '~/api/user/request';
import { apiAdd as fileApiAdd } from '~/api/upload/request';
import type { UserModel, UpdateInfoType } from '~/api/user/model';
import type { AddModel as FileAddModel  } from '~/api/upload/model';

const userInfo = useState<UserModel>("userInfo");
const formData = reactive<UpdateInfoType>({
  account: '',
  email: '',
  password: '',
  code: ''
});
const { $message } = useNuxtApp();
const images = ref<Upload.FileInfo[]>([]);
const fileList = ref<Array<Upload.FileInfo>>([]);

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
  const params: UpdateInfoType = {
    ...formData,
    avatar: JSON.stringify(images.value[0])
  }

  apiUpdateUserInfo(params).then((res) => {
    if (res.data) {
      $message.show({
        message: '操作成功',
        type: 'success'
      });
      useClearUserInfoStorage();
      useUserInfo().then(res => {
        if (res) {
          userInfo.value = res;
          getUserInfo();
        }
      });
    }
  })
}

function getUserInfo() {
  formData.id = userInfo.value.id;
  formData.account = userInfo.value.account || '';
  formData.email = userInfo.value.email;
  formData.avatar = userInfo.value.avatar;
  
  const imageIds: Upload.FileInfo = userInfo.value.avatar ? JSON.parse(userInfo.value.avatar) : [];
  
  fileList.value = [imageIds].map(e => {
    return {
      id: e.id,
      fullPath: splicingImageUrl(e.fullPath) || ""
    }
  });
}

onNuxtReady(() => {
  getUserInfo();
});

</script>
<template>
  <personal-center>
    <div class="main__content flex__column">
      <div class="form__item">
        <label class="label">头像</label>
        <com-upload 
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
        <com-button style="width: 100px" @click.stop="handleUpdate">
          <span>保存</span>
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