export type EditModel = {
  id: number;
  name: string;
  proficiency: number;
  sort: number;
  [key: string]: any;
}

export type AddModel = {
  name: string;
  sort: number;
  proficiency: number;
}

export type ListType = Array<{
  id: number;
  createTime: string;
  updateTime: string;
  name: string;
  userId: number;
  proficiency: number;
  sort: number;
}>

