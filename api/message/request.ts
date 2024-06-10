import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  messageAddPath,
  messageGetList
} = apiMap;

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(messageGetList, {
    method: 'get',
    params
  });
  return res
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(messageAddPath, {
    method: 'post',
    body: params
  });
  return res
}
