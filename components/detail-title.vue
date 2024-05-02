<script lang="ts" setup>
type Prop = {
  placeholder?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: '项目名称'
})

const router = useRouter();
const title = ref('');
const textNumber = computed(() => {
  const len = title.value.length ? title.value.length : 0;
  return Math.abs(5 - len) >= 0 ? 5 - len : 0;
});

function goBack() {
  router.back();
}
</script>
<template>
  <div class="detail__title">
    <div class="container flex__row">
      <div class="flex__row flex1">
        <div class="flex__row mr1 c-p" @click="goBack">
          <com-icon 
            width="30px" 
            height="50px" 
            icon="profileleft"
          ></com-icon>
          <span class="fs24 nowrap display-0-none">返回</span>
        </div>
        <div class="flex__row flex1">
          <com-form-input 
            class="detail__input"
            v-model="title" 
            :is-label="false"
            :placeholder="props.placeholder"
          >
          </com-form-input>
          <span 
            v-if="textNumber > 0" 
            class="nowrap fs18 detail__notice display-0-none ml1"
          >还需要输入{{ textNumber }}个字</span>
        </div>
        <div class="btn__group flex__row--between">
          <com-button class="btn" 
            :need-inner-outline="false" 
            bg-color="#898989"
          >
            <span class="fs20">当草稿</span>
          </com-button>
          <com-button class="btn">
            <span class="fs20">发布</span>
          </com-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.detail__title {
  height: 80px;
  background-color: var(--white-color);
}

.btn {
  width: 100px;
  height: 45px;
  padding: 0;
}

.detail__input {
  border-radius: 10px;
  border: 0;
  outline: 0;
  min-width: 100px;
}

.detail__notice {
  max-width: 200px;
  width: 100%;
  text-align: center;
}

.btn__group {
  max-width: 210px;
  width: 100%;
}

:deep(.detail__input input) {
  background-color: var(--readonly-color);
  border-radius: 10px;
  text-indent: 1.5em!important;
}
</style>