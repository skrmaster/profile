<script lang="ts" setup>
type Prop = {
  placeholder?: string;
  titleValue?: string;
  mode?: DetailTitle.Mode;
}

const emit = defineEmits<{
  'button-action': [val: DetailTitle.Action, name: string]
}>();
const props = withDefaults(defineProps<Prop>(), {
  placeholder: '项目名称',
  titleValue: '',
  mode: 'add'
});

const router = useRouter();
const title = ref('');
const titleError = ref(false);
const textNumber = computed(() => {
  const len = title.value?.length ? title.value?.length : 0;
  return Math.abs(5 - len) >= 0 ? 5 - len : 0;
});

watch(() => props.titleValue, (val) => {
  if (val) {
    title.value = val;
  }
});

watch(textNumber, (val) => {
  if (val === 0) {
    titleError.value = false;
  }
});

function goBack() {
  router.back();
}

function handleSubmit(val: DetailTitle.Action) {
  if (unref(title).length < 5) {
    titleError.value = true;
    return;
  } else {
    titleError.value = false;
  }
  emit('button-action', val, unref(title));
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
            icon="profile-left"
          ></com-icon>
          <span class="fs24 nowrap display-0-none">返回</span>
        </div>
        <div class="flex__row flex1">
          <com-form-input 
            class="detail__input"
            v-model="title" 
            :is-label="false"
            :placeholder="props.placeholder"
            :is-error="titleError"
            clearable
          >
          </com-form-input>
          <span 
            v-if="textNumber > 0" 
            class="nowrap fs18 detail__notice ml1"
          >还需要输入{{ textNumber }}个字</span>
        </div>
        <div class="display-2-none display-1-none display-0-none">
          <div v-if="mode === 'add'" class="ml1 btn__group flex__row--between">
            <com-button 
              class="btn" 
              :need-inner-outline="false" 
              bg-color="#898989"
              @click.stop="handleSubmit('submit-tmp')"
            >
              <span class="fs20">当草稿</span>
            </com-button>
            <span style="width: 10px"></span>
            <com-button class="btn"
              @click.stop="handleSubmit('submit')"
            >
              <span class="fs20">发布</span>
            </com-button>
          </div>
          <div class="ml1 btn__group" v-else>
            <com-button
            @click.stop="handleSubmit('submit-edit')"
            >确认修改</com-button>
          </div>
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
  border-color: transparent;
  outline: 0;
  min-width: 100px;
}

.detail__notice {
  max-width: 200px;
  width: 100%;
  text-align: center;
}

.btn__group {
  max-width: 220px;
  width: 100%;
}

:deep(.detail__input input) {
  background-color: var(--readonly-color);
  border-radius: 10px;
  text-indent: 1.5em!important;
}

:deep(.detail__input) {
  background-color: var(--readonly-color);
}
</style>