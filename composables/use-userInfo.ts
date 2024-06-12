import { apiUserInfo } from '~/api/user/request';
import type { UserModel } from '~/api/user/model';


export async function useUserInfo(): Promise<UserModel | undefined> {
  const userInfoState = useState<UserModel | undefined>('userInfo');
  const authCookie = useCookie('s-auth-cookie');
  const canUse = authCookie.value ? JSON.parse(authCookie.value) : false;
  const userInfo = getStorageUserInfo();

  if (userInfoState.value?.id) {
    return userInfoState.value;
  }

  if (canUse) {
    if (userInfo) {
      userInfoState.value = userInfo;
      return new Promise((resolve) => resolve(userInfo));
    } else {
      const result = await getUserInfo();
      userInfoState.value = result;
      return result;
    }
  } else {
    if (userInfo) {
      userInfoState.value = userInfo;
      return new Promise((resolve) => resolve(userInfo));
    } else {
      return new Promise((resolve) => resolve(undefined));
    }
  }
}

async function getUserInfo(): Promise<UserModel> {
  const res = await apiUserInfo();
  return res.data;
}

function getStorageUserInfo(): UserModel | undefined {
  try {
    const storage = new StorageSuger('localStorage');
    const storage1 = new StorageSuger('sessionStorage');

    const userInfo = storage.getValue('userInfo');
    const userInfo1 = storage1.getValue('userInfo');

    if (userInfo || userInfo1) {
      const user = aesDecrypt(JSON.parse(userInfo as string) || JSON.parse(userInfo1 as string));
      const info: UserModel = JSON.parse(user);
      return info;
    } else {
      return;
    }
  } catch(e) {
    
  }
}
