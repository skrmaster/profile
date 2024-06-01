import { apiUserInfo } from '~/api/user/request';
import type { UserModel } from '~/api/user/model';

export async function useUserInfo(): Promise<UserModel | undefined> {
  const authCookie = useCookie('s-auth-cookie');
  const canUse = authCookie.value ? JSON.parse(authCookie.value) : false;
  if (canUse) {
    const userInfo = useCookie<string>('s-u');
    if (userInfo.value) {
      const user = aesDecrypt(userInfo.value);
      const info = JSON.parse(user);
      return new Promise((resolve) => resolve(unref(info)));
    } else {
      const userInfo = getStorageUserInfo();

      if (userInfo) {
        return new Promise((resolve) => resolve(userInfo));
      } else {
        return await getUserInfo();
      }
    }
  } else {
    if (!useCookie<string>('s-u').value) {
      return await getUserInfo();
    } else {
      const userInfo = getStorageUserInfo();
      if (userInfo) {
        return new Promise((resolve) => resolve(userInfo));
      } else {
        return new Promise((resolve) => resolve(undefined));
      }
    }
  }
}

async function getUserInfo(): Promise<UserModel> { 
  const res = await apiUserInfo();
  return res.data;
}

function getStorageUserInfo(): UserModel | undefined {
  const storage = new StorageSuger('localStorage');
  const storage1 = new StorageSuger('sessionStorage');
  const userInfo = storage.getValue('userInfo');
  const userInfo1 = storage1.getValue('userInfo');

  if (userInfo || userInfo1) {
    const user = aesDecrypt(JSON.parse(userInfo as string) || JSON.parse(userInfo1 as string));
    const info: UserModel = JSON.parse(user);
    return info
  } else {
    return;
  }
}
