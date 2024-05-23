export type AddModel = {
  content: string;
  from?: string;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  createTime: string;
  updateTime?: string;
}>