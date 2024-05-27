import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  recordListPath,
  recordAddPath,
  recordEditPath,
  recordDeletePath,
  recordGetInfoPath,
  recordRankListPath,
  recordQueryListPath,
  recordCollectionListPath,
  recordCountPath
} = apiMap;

export async function apiGetInfo(id: string) {
  const url = recordGetInfoPath + `/${id}`

  const res = await httpClient<Type.EditModel>(url, {
    method: 'get'
  });
  return res;
}

export async function apiGetRankList(length: number) {
  const res = await httpClient<Type.List>(recordRankListPath, {
    method: 'get',
    params: {
      length
    }
  });
  return res;
}

export async function apiQueryList(params: Type.QueryParam) {
  const res = await httpClient<ResponsePagination<Type.List>>(recordQueryListPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.List>>(recordListPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiCollectionList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.List>>(recordCollectionListPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiRecordCount(params: Type.CountParam) {
  const res = await httpClient<boolean>(recordCountPath, {
    method: 'get',
    params
  });
  return res;
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(recordAddPath, {
    method: 'post',
    body: params
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = recordEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = recordDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res;
}
