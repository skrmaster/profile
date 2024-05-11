export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to)
  if (to.fullPath === '/infors') {
    return navigateTo('/applyCode')
  }
  if (to.fullPath === '/comePay/comePay') {
    return abortNavigation('禁止进入页面')
  }
});
