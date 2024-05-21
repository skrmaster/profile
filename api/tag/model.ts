export type AddModel = {
  name: string;
  category: number;
  icon: number;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type TagListType = Array<{
  id: number;
  createTime: string;
  updateTime: string;
  name: string;
  icon: string;
  category: number;
}>
