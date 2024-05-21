export type AddModel = {
  name: string;
  icon: number;
  title: string;
  content?: string;
  tags?: string;
  status: number;
  category: number;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  createTime: string;
  updateTime: string;
  view: number;
  like: number;
  dislike: number;
  collection: number;
}>