import type * as Type from "./skillModel";
import { httpClient } from "../index";

const { 
  skillListPath: skillList,
  skillAddPath: skillAdd,
  skillEditPath: skillEdit,
  skillDeletePath: skillDelete,
} = routerMap;

export async function apiSkillGetList(params: Omit<Pagination, 'total'>) {
  const res = await httpClient<ResponsePagination<Type.SkillListType>>(skillList, {
    method: 'get',
    params
  });
  return res
}

export async function apiSkillAdd(params: Type.AddModel) {
  const res = await httpClient<boolean>(skillAdd, {
    method: 'post',
    body: params
  });
  return res
}

export async function apiSkillUpdate(params: Type.EditModel) {
  const updateUrl = skillEdit + `/${params.id}`
  const res = await httpClient<boolean>(updateUrl, {
    method: 'put',
    body: params
  });
  return res
}

export async function apiSkillDelete(id: number) {
  const deleteUrl = skillDelete + `/${id}`
  const res = await httpClient<boolean>(deleteUrl, {
    method: 'delete'
  });
  return res
}
