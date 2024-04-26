<script lang="ts" setup>
type Prop = {
  avatarUrl?: string;
  nickname: string;
}

const props = defineProps<Prop>();
const preview = ref();

function handlePreview() {
  console.log(preview);
  
  preview.value.open();
}
</script>
<template>
  <div class="avatar flex__center">
    <com-preview-image 
      ref="preview"
      :image-urls="[props.avatarUrl]"
    >
    </com-preview-image>
    <img 
      v-if="props.avatarUrl" 
      :src="props.avatarUrl" 
      :alt="props.nickname"
      class="scale-down"
      @click="handlePreview"
    />
    <div v-else>
      <span class="fs14 line1__ellipsis">{{ props.nickname }}</span>
    </div>
  </div>
</template>
<style scoped>
.avatar {
  height: 69px;
  width: 69px;
  border: 1px solid var(--primary-border-color);
  border-radius: 50%;
  background: var(--white-color);
}

.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%
}

.fill {
  object-fit: fill;
}

.scale-down {
  object-fit: scale-down;
}
</style>