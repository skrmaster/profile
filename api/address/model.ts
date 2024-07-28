export type AddModel = {
  name?: string;
  iconUrl?: string;
  categoryId: string;
  link: string;
  needUpdate: number;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  createTime: string;
  updateTime?: string;
}>

export type ListByCategory = {
  category: {
    name: string;
    id: number;
    iconClass: string;
  }
  list: ListType;
}[];
