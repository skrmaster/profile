import type { UserModel, LoginType, RegisterType } from "./model";
import { httpClient } from "../index";

const { loginPath, registerPath, userInfoPath } = apiMap;

export async function apiUserInfo() {
  const res = await httpClient<UserModel>(userInfoPath, {
    method: 'GET'
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
  const res = await httpClient<boolean>(registerPath, {
    method: 'post',
    body: params
  });
  return res;
}
