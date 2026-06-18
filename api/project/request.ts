import type * as Type from "./model";
import { httpClient } from "../index";
import projectData from "~/public/data/table_project.json";

const {
  projectGetPath,
  projectListPath,
  projectAddPath,
  projectEditPath,
  projectDeletePath,
} = apiMap;

export function apiGetInfo(id: string): Type.EditModel {
  const data = keysToCamel(projectData.RECORDS) as any;

  return data.find((e: any) => e.id == id);
}

export function apiGetList(
  params?: Omit<Pagination, "total">,
): ResponsePagination<Type.ListType> {
  const data = keysToCamel(projectData.RECORDS) as any;

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

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(projectAddPath, {
    method: "post",
    body: params,
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = projectEditPath + `/${params.id}`;
  const res = await httpClient<string>(updateUrl, {
    method: "put",
    body: params,
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = projectDeletePath + `/${id}`;
  const res = await httpClient<string>(deleteUrl, {
    method: "delete",
  });
  return res;
}
