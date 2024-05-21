export type AddModel = {
  name: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  summary?: string;
  department?: string;
  playLink?: string;
  stackIds?: string;
  imageIds?: string;
  videoIds?: string;
  tagIds?: string;
  sort: number;
}

export type EditModel = AddModel & {
  id: number;
  [key: string]: any;
}

export type ListType = Array<EditModel & {
  creatorId: number;
  createTime: string;
  updateTime: string;
}>