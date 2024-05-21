import type { userModel, loginType, registerType } from "./model";
import { httpClient } from "../index";

const { loginPath, registerPath } = apiMap;

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
