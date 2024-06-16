<script lang="ts" setup>
const props: Layouts.BgSettingProps = useAttrs();
const propsCopy: Layouts.BgSettingProps = reactive({
  'bg-change-color': false,
  'bg-default-size': false,
  'bg-style-content': ''
});

function setDefaultProps() {
  for (const item in propsCopy) {
    if (item in props) {
      propsCopy[item] = props[item];
    }
  }
}

setDefaultProps();
</script>
<template>
  <com-background
    :bg-change-color="propsCopy['bg-change-color']"
    :bg-style-content="propsCopy['bg-style-content']"
    :bg-default-size="propsCopy['bg-default-size']"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <slot></slot>
  </com-background>
  <com-footer></com-footer>
  <div class="fill__block display-5-none display-4-none display-3-none"></div>
</template>
<style scoped>
.fill__block {
 height: 120px;
}
</style>