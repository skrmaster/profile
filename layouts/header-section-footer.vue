<script lang="ts" setup>
const props: Layouts.BgSettingProps = useAttrs();
const propsCopy: Layouts.BgSettingProps = reactive({
  bgChangeColor: false,
  bgDefaultSize: false,
  bgStyleContent: ''
});

function setDefaultProps() {
  for (const item in propsCopy) {
    if (item in props) {
      props[item] = propsCopy[item];
    }
  }
}

setDefaultProps();
</script>
<template>
  <com-background
    :bg-change-color="propsCopy.bgChangeColor"
    :bg-style-content="propsCopy.bgStyleContent"
    :bg-default-size="propsCopy.bgDefaultSize"
  >
    <com-navigation class="display-2-none display-1-none display-0-none"></com-navigation>
    <com-navigation-small class="display-5-none display-4-none display-3-none"></com-navigation-small>
    <slot></slot>
    <com-footer></com-footer>
    <div class="fill__block display-5-none display-4-none display-3-none"></div>
  </com-background>
</template>
<style scoped>
.fill__block {
 height: 120px;
}
</style>