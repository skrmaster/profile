export type AddModel = {
  category: number;
  file: File;
  name?: string;
  url?: string;
  width?: string;
  height?: string;
  title?: string;
  time?: string;
}

export type FileResponseModel = {
  fullPath: string,
  id: string;
}
