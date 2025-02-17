export type AddModel = {
  name: string;
  sort: number;
  iconClass: string;
  display: number;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  createTime: string;
  updateTime?: string;
}>

export type Option = {
  name: string;
  id: string;
}
