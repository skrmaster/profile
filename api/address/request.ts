import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  navigationListPath,
  navigationAddPath,
  navigationEditPath,
  navigationDeletePath,
  navigationListCategoryPath,
  navigationGetIconPath: navationGetIconPath
} = apiMap;

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(navigationListPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiGetIcons() {
  const res = await httpClient<string>(navationGetIconPath, {
    method: 'GET'
  });
  return res;
}

export async function apiGetListByCategory() {
  const res = await httpClient<Type.ListByCategory>(navigationListCategoryPath, {
    method: 'get'
  });
  return res;
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(navigationAddPath, {
    method: 'post',
    body: params
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = navigationEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = navigationDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res
}
