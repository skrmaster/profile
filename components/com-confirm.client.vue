<script lang="ts" setup>
type Prop = {
  message: string;
  buttonConfirmText?: string;
  buttonCannelText?: string;
  title?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  title: '注意!',
  buttonConfirmText: '确认',
  buttonCannelText: '取消'
});

const visible = ref(true);

</script>
<template>
  <com-model-confirm
    style="width: 550px; margin: 0 auto;"
    v-model="visible"
  >
    <div class="confirm-message__box">
      <p class="common__title">{{ props.title }}</p>
      <p class="fs22 mt1 message__body">{{ props.message }}</p>
    </div>
  </com-model-confirm>
</template>
<style scoped>
.confirm-message__box {
  background-color: var(--white-color);
  min-height: 200px;
  padding: 20px;
}

.message__body {
  text-indent: 1em;
}
</style>