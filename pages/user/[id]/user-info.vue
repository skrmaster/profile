<script lang="ts" setup>
import PersonalCenter from './components/personal-center.vue';
import type { UserModel, UpdateInfoType } from '~/api/user/model';

const userInfo = useState<UserModel>("userInfo");
const formData = reactive<UpdateInfoType>({
  account: '',
  email: '',
  password: '',
  code: ''
});


onNuxtReady(() => {
  const localStorage = new StorageSuger("localStorage");
  const sectionStorage = new StorageSuger("sessionStorage");
  
  const userInfo1 = localStorage.getValue("userInfo");
  const userInfo2 = sectionStorage.getValue("userInfo");
  
  if (userInfo1) {
    userInfo.value = JSON.parse(userInfo1 as string);
  } else if (userInfo2) {
    userInfo.value = JSON.parse(userInfo2 as string);
  }

  formData.account = userInfo.value.account || '';
  formData.email = userInfo.value.email;
});

</script>
<template>
  <personal-center>
    <div class="main__content flex__column">
      <div class="form__item">
        <label class="label">头像</label>
        <com-upload 
          label="上传头像"
          :limit="1"
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
        <com-button style="width: 100px">
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