import type * as Type from "./model";
import { httpClient } from "../index";

const { 
  uploadSingleFilePath,
  deleteSingleFilePath
} = apiMap;

export async function apiAdd(params: Type.AddModel & Record<string, any>) {
  const fileContent = new FormData();

  fileContent.append('file', params.file);

  const res = await httpClient<Upload.FileInfo>(uploadSingleFilePath, {
    method: 'POST',
    params: params,
    body: fileContent
  });
  return res;
}

export async function apiDelete(id: number) {
  const deleteUrl = deleteSingleFilePath + `/${id}`
  const res = await httpClient<string>(deleteUrl, {
    method: 'DELETE'
  });
  return res;
}
