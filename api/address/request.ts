import type * as Type from "./model";
import { httpClient } from "../index";

const {
  navigationListPath,
  navigationAddPath,
  navigationEditPath,
  navigationDeletePath,
  navigationListCategoryPath,
  navigationGetIconPath: navationGetIconPath,
} = apiMap;

export async function apiGetList(params: Omit<Pagination, "total">) {
  const res = await httpClient<ResponsePagination<Type.ListType>>(
    navigationListPath,
    {
      method: "get",
      params,
    },
  );
  return res;
}

export async function apiGetIcons() {
  const res = await httpClient<string>(navationGetIconPath, {
    method: "GET",
  });
  return res;
}

export async function apiGetListByCategory(): Promise<Type.ListByCategory> {
  const { app } = useRuntimeConfig();

  const [categoryRes, navigationRes] = await Promise.all([
    $fetch<JSONData<any>>(`${app.baseURL}data/table_address_category.json`),
    $fetch<JSONData<any>>(`${app.baseURL}data/table_address_navigation.json`),
  ]);

  const categories = keysToCamel(categoryRes.RECORDS);
  const navigations = keysToCamel(navigationRes.RECORDS);

  const navigationMap = new Map<number, any[]>();

  for (const item of navigations) {
    const list = navigationMap.get(item.categoryId) ?? [];
    list.push(item);
    navigationMap.set(item.categoryId, list);
  }

  const res: Type.ListByCategory = categories
    .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((category: any) => ({
      category: {
        id: category.id,
        name: category.name,
        iconClass: category.iconClass,
        display: category.display,
      },
      list: navigationMap.get(category.id) ?? [],
    }));

  return res;
}

export async function apiAdd(params: Type.AddModel) {
  const res = await httpClient<string>(navigationAddPath, {
    method: "post",
    body: params,
  });
  return res;
}

export async function apiUpdate(params: Type.EditModel) {
  const updateUrl = navigationEditPath + `/${params.id}`;
  const res = await httpClient<string>(updateUrl, {
    method: "put",
    body: params,
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = navigationDeletePath + `/${id}`;
  const res = await httpClient<string>(deleteUrl, {
    method: "delete",
  });
  return res;
}
