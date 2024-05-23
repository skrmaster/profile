import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  aphorismsListPath,
  aphorismsAddPath,
  aphorismsEditPath,
  aphorismsDeletePath,
} = apiMap;

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(aphorismsListPath, {
    method: 'get',
    params
  });
  return res
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(aphorismsAddPath, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = aphorismsEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res
}

export async function apiDelete(id: number) {
  const deleteUrl = aphorismsDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res
}
