<script lang="ts" setup>
type Prop = {
  message: string;
  buttonConfirmText?: string;
  buttonCannelText?: string;
  title?: string;
  zIndex: string;
  id: string;
}

const props = withDefaults(defineProps<Prop>(), {
  title: '注意!',
  buttonConfirmText: '确认',
  buttonCannelText: '取消'
});

const zIndex = ref((): string => props.zIndex);
const visible = ref(true);

watch(visible, (newVal: boolean) => {
  if (newVal) {    
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = 'auto';
  }
});

function escapeKeyUp(e: KeyboardEvent) {
  if (e.code === 'Escape') {
    document.documentElement.style.overflow = 'auto';
    closeModel();
  }
}

function closeModel() {
  visible.value = false;
}

function handleConfirm() {

}

function handleClose() {
  removeElementById(props.id);
  closeModel();
}

onMounted(() => {
  document.addEventListener('keyup', escapeKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', escapeKeyUp);
});
</script>
<template>
  <div 
    :id="props.id"
    v-show="visible"
    class="model" 
    :style="{
      zIndex: zIndex()
    }"
  >
    <div class="wh100">
      <div
        class="close flex__center" 
        title="关闭" 
        @click.stop="closeModel"
      >
        <div class="flex1 flex__center close__tip">
          <com-icon 
            width="15px" 
            height="15px" 
            color="var(--white-color)" 
            class="close__icon" 
            icon="profile-close"
          ></com-icon>
        </div>
      </div>
      <div class="wh100 flex__column--center">
        <div class="message">
          <p class="common__title mb1">{{ props.title }}</p>
          <p class="fs22" style="text-indent: 1em;">{{ props.message }}</p>
        </div>
        <div class="confirm">
          <div class="confirm__box">
            <div class="flex__row--end btn__box">
              <com-button 
                class="cannel__btn flex__row--between mr1" 
                prefix-icon="profile-circle-close" 
                bgColor="var(--cannel-btn-color)"
                @click="handleClose"
              >
                <span class="fs16 color--primary">取消</span>
              </com-button>
              <com-button 
                prefix-icon="profile-circle-confirm"
                class="confirm__btn flex__row--between"
                @click="handleConfirm"
              >
                <span class="fs16">确定</span>
              </com-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.model {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--model-bg-color);
}

.close {
  cursor: pointer;
  position: absolute;
  right: 10%;
  top: 10%;
  transform: translateY(-50%);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: var(--model-control-bg-color);
  user-select: none;
  z-index: 999;
}

.message {
  border-radius: 10px 10px 0 0;
  max-width: 500px;
  width: 100%;
  background-color: var(--white-color);
  min-height: 200px;
  padding: 20px;
}

.close__tip {
  position: relative;
}

.close__tip::after {
  content: "ESC";
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--white-color);
}

.confirm {
  max-width: 500px;
  width: 100%;
  box-shadow: var(--box-shadow);
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}

.confirm__box {
  padding: 0 20px;
  background: var(--white-color);
  height: 72px;
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 2px solid var(--tag-border-color);
}

.btn__box {
  flex: 1;
}

.cannel__btn { 
  max-width: 100px;
  min-width: 50px;
  width: 100%;
  border: 1px solid var(--primary-border-color);
}

.confirm__btn { 
  max-width: 100px;
  min-width: 50px;
  width: 100%;
}

:deep(.confirm__btn .icon) {
  color: var(--white-color)!important;
}
</style>