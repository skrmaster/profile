export type AddModel = {
  name?: string;
  iconUrl?: string;
  category: string;
  link: string;
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
  }
  list: ListType;
}[];
