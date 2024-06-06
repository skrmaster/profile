const permissonList = [
  routerMap.followPath,
  routerMap.projectListPath,
  routerMap.skillMgtPath,
  routerMap.tagMgtPath,
  routerMap.projectMgtPath,
  routerMap.recordMgtPath,
  routerMap.navigationPath,
  routerMap.aphorismsPath,
  routerMap.projectDetailPath,
  routerMap.recordDetailPath
];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return;

  const needAuth = isPathInList(to.fullPath);
  
  if (needAuth) {
    const userPermissions = await getUserPermissions();
    const auth = hasPermissions(to.fullPath, userPermissions);
    
    if (!auth) {
      return navigateTo({
        path: routerMap.noAuthPath
      });
    }
  } else {
    return;
  }
});

export function isPathInList(path: string): boolean {
  for (const route of permissonList) {    
    const regex = new RegExp('^' + route.replace(/:\w+/g, '\\w+') + '$');
    if (regex.test(path) || route == path) {
      return true;
    }
  }

  return false;
}

export function hasPermissions(path: string, userPermissions?: string): boolean {
  const isAuthPath = isPathInList(path);
  if (userPermissions == '1' && isAuthPath) {
    return true
  }
  return false;
}

export async function getUserPermissions(): Promise<string | undefined> {
  const userInfo = await useUserInfo();
  
  if (userInfo) {
    const res = userInfo.permission ? JSON.parse(userInfo.permission) : '';
    return res;
  } else {
    return;
  }
}
