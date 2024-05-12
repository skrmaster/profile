import type { userModel, loginType, registerType } from "./userModel";
import { httpClient } from "../index";

const { loginPath, registerPath } = routerMap;

export async function apiLogin(params: loginType) {
  const res = await httpClient<userModel>(loginPath, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiRegister(params: registerType) {
  const res = await httpClient<boolean>(registerPath, {
    method: 'post',
    body: params
  });
  return res
}
