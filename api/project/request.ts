import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  projectGetPath,
  projectListPath,
  projectAddPath,
  projectEditPath,
  projectDeletePath,
} = apiMap;

export async function apiGetInfo(id: string) {
  const url = projectGetPath + `/${id}`;
  const res = await httpClient<Type.EditModel>(url, {
    method: 'get'
  });
  return res;
}

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(projectListPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(projectAddPath, {
    method: 'post',
    body: params
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = projectEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = projectDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res;
}
