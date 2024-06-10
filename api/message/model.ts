export type AddModel = {
  userName: string;
  contactWay: string;
  content: string;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<{
  createTime: string;
  updateTime?: string;
}>
