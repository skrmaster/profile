import type { UserModel, LoginType, RegisterType, UpdateInfoType } from "./model";
import { httpClient } from "../index";

const { loginPath, registerPath, userInfoPath, userUpdatePath, userLogoutPath } = apiMap;

export async function apiUserInfo() {
  const res = await httpClient<UserModel>(userInfoPath, {
    method: 'GET'
  });
  return res;
}

export async function apiUserLogout() {
  const cookie = useCookie('s-getu');
  cookie.value = false.toString();

  const res = await httpClient<boolean>(userLogoutPath, {
    method: 'GET'
  });
  return res;
}

export async function apiUpdateUserInfo(params: UpdateInfoType) {
  const url = userUpdatePath + `/${params.id}`

  const res = await httpClient<boolean>(url, {
    method: 'PUT',
    body: params
  });
  return res;
}

export async function apiLogin(params: LoginType) {
  const res = await httpClient<string>(loginPath, {
    method: 'post',
    body: params
  });
  return res;
}

export async function apiRegister(params: RegisterType) {
  const res = await httpClient<boolean | string>(registerPath, {
    method: 'post',
    body: params
  });
  return res;
}
