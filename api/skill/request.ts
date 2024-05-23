import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  skillListPath,
  skillAddPath,
  skillEditPath,
  skillDeletePath,
} = apiMap;

export async function apiSkillGetList(params?: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(skillListPath, {
    method: 'get',
    params
  });
  return res
}

export async function apiSkillAdd(params: Type.AddModel) {
  const res = await httpClient<boolean>(skillAddPath, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiSkillUpdate(params: Type.EditModel) {
  const updateUrl = skillEditPath + `/${params.id}`
  const res = await httpClient<boolean>(updateUrl, {
    method: 'put',
    body: params
  });
  return res
}

export async function apiSkillDelete(id: number) {
  const deleteUrl = skillDeletePath + `/${id}`
  const res = await httpClient<boolean>(deleteUrl, {
    method: 'delete'
  });
  return res
}
