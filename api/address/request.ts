import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  navgationListPath,
  navgationAddPath,
  navgationEditPath,
  navgationDeletePath,
  navgationListCategoryPath
} = apiMap;

export async function apiGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(navgationListPath, {
    method: 'get',
    params
  });
  return res
}

export async function apiGetListByCategory(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(navgationListCategoryPath, {
    method: 'get',
    params
  });
  return res
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(navgationAddPath, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = navgationEditPath + `/${params.id}`
  const res = await httpClient<string>(updateUrl, {
    method: 'put',
    body: params
  });
  return res
}

export async function apiDelete(id: number) {
  const deleteUrl = navgationDeletePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'delete'
  });
  return res
}
