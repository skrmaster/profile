<script lang="ts" setup>
type Prop = {
  avatarUrl?: string;
  nickname: string;
  type?: 'fill' | 'cover' | 'scale-down' | 'contain' | 'none'
}

const props = withDefaults(defineProps<Prop>(), {
  avatarUrl: '',
  type: 'cover'
});
</script>
<template>
  <div class="avatar flex__center">
    <img 
      v-if="props.avatarUrl" 
      :src="props.avatarUrl" 
      :alt="props.nickname"
      :style="{
        'object-fit': props.type
      }"
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
  color: var(--primary-color);
}

.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%
}
</style>