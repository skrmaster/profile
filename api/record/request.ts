import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  recordListPath,
  recordAddPath,
  recordEditPath,
  recordDeletePath,
} = apiMap;

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(recordListPath, {
    method: 'get',
    params
  });
  return res
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(recordAddPath, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = recordEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res
}

export async function apiDelete(id: number) {
  const deleteUrl = recordDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res
}
