export type AddModel = {
  title: string;
  content?: string;
  tags?: string;
  status: number;
  category: string;
}

export type EditModel = AddModel & {
  id: string;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  createTime: string;
  updateTime?: string;
}>