import { apiUserInfo } from '~/api/user/request';
import type { UserModel } from '~/api/user/model';

export async function useUserInfo(): Promise<UserModel> {
  const authCookie = useCookie('s-auth-cookie');
  const canUse = authCookie.value ? JSON.parse(authCookie.value) : false;
  if (canUse) {
    const userInfo = useCookie<string>('s-u');
    if (userInfo.value) {
      const user = aesDecrypt(userInfo.value);
      const info: UserModel = JSON.parse(user);
      return info;
    } else {
      return await getUserInfo();
    }
  } else {
    return await getUserInfo();
  }
}

async function getUserInfo(): Promise<UserModel> { 
  const res = await apiUserInfo();
  return res.data;
}
