import type { userModel, loginType } from "./userModel";
import { httpClient } from "../index";

export const loginUrl = '/user/login';

export async function apiLogin(params: loginType) {
  const res = await httpClient<userModel>(loginUrl, {
    method: 'post',
    body: params
  });
  return res
}
