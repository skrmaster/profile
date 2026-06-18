import type * as Type from "./model";
import { httpClient } from "../index";
import recordData from "~/public/data/table_record.json";
import userJSONData from "~/public/data/table_user.json";

const {
  recordListPath,
  recordAddPath,
  recordEditPath,
  recordDeletePath,
  recordGetInfoPath,
  recordRankListPath,
  recordQueryListPath,
  recordCollectionListPath,
  recordCountPath,
  recordAnonymousViewPath,
} = apiMap;

export function apiGetInfo(id: string): Type.EditModel {
  const data = keysToCamel(recordData.RECORDS) as any;
  const userData = keysToCamel(userJSONData.RECORDS) as any;

  const res: Type.EditModel = data.find((e: any) => e.id == id);
  res.author = userData.find((e: any) => e.id == res.authorId).account;

  return res;
}

export async function apiGetRankList(length: number) {
  const res = await httpClient<Type.List>(recordRankListPath, {
    method: "get",
    params: {
      length,
    },
  });
  return res;
}

export function apiQueryDataList(
  params: Type.QueryParam,
): ResponsePagination<Type.List> {
  let data = keysToCamel(recordData.RECORDS) as any;

  if (params.title?.trim()) {
    const keyword = params.title.trim().toLowerCase();

    data = data.filter((item: any) =>
      item.title?.toLowerCase().includes(keyword),
    );
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

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
export function apiGetList(params: Omit<Pagination, "total">) {
  return apiQueryDataList(params);
}

export async function apiCollectionList(params: Omit<Pagination, "total">) {
  const res = await httpClient<ResponsePagination<Type.List>>(
    recordCollectionListPath,
    {
      method: "get",
      params,
    },
  );
  return res;
}

export async function apiRecordCount(params: Type.CountParam) {
  const res = await httpClient<boolean>(recordCountPath, {
    method: "get",
    params,
  });
  return res;
}

export async function apiAnonymousRecordCount(recordId: string) {
  const res = await httpClient<boolean>(recordAnonymousViewPath, {
    method: "GET",
    params: {
      recordId,
    },
  });
  return res;
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(recordAddPath, {
    method: "post",
    body: params,
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = recordEditPath + `/${params.id}`;
  const res = await httpClient<string>(updateUrl, {
    method: "put",
    body: params,
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = recordDeletePath + `/${id}`;
  const res = await httpClient<string>(deleteUrl, {
    method: "delete",
  });
  return res;
}
