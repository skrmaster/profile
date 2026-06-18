import type * as Type from "./model";
import { httpClient } from "../index";

const {
  skillListPath,
  skillAddPath,
  skillEditPath,
  skillDeletePath,
  skillStackListPath,
} = apiMap;

export async function apiSkillGetList(
  params?: Omit<Pagination, "total">,
): Promise<ResponsePagination<Type.ListType>> {
  const { app } = useRuntimeConfig();
  const json = (
    await $fetch<JSONData<Type.ListType>>(`${app.baseURL}data/table_skill.json`)
  ).RECORDS;

  const data = keysToCamel(json);

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    list: data.slice(start, end),
    pagination: {
      total: data.length,
      page,
      pageSize,
    },
  };
}

export async function apiSkillStackGetList() {
  const res = await httpClient<Type.ListType>(skillStackListPath, {
    method: "get",
  });
  return res;
}

export async function apiSkillAdd(params: Type.AddModel) {
  const res = await httpClient<boolean>(skillAddPath, {
    method: "post",
    body: params,
  });
  return res;
}

export async function apiSkillUpdate(params: Type.EditModel) {
  const updateUrl = skillEditPath + `/${params.id}`;
  const res = await httpClient<boolean>(updateUrl, {
    method: "put",
    body: params,
  });
  return res;
}

export async function apiSkillDelete(id: number) {
  const deleteUrl = skillDeletePath + `/${id}`;
  const res = await httpClient<boolean>(deleteUrl, {
    method: "delete",
  });
  return res;
}
