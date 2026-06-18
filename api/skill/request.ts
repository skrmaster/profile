import type * as Type from "./model";
import { httpClient } from "../index";
import skillData from "~/public/data/table_skill.json";

const {
  skillListPath,
  skillAddPath,
  skillEditPath,
  skillDeletePath,
  skillStackListPath,
} = apiMap;

export function apiSkillGetList(
  params?: Omit<Pagination, "total">,
): ResponsePagination<Type.ListType> {
  const data = keysToCamel(skillData.RECORDS) as any;

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const end = start * 1 + pageSize * 1;

  return {
    list: data?.slice(start, end),
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
