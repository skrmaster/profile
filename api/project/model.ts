export type AddModel = {
  name: string;
  status?: number;
  startTime?: string;
  endTime?: string;
  description?: string;
  summary?: string;
  department?: string;
  playLink?: string;
  stackIds?: any;
  imageIds?: any;
  videoIds?: any;
  tagIds?: any;
  sort: number;
}

export type EditModel = AddModel & {
  id: string;
  [key: string]: any;
}

export type ListItem = EditModel & {
  creatorId: number;
  createTime: string;
  updateTime?: string;
}

export type ListType = Array<ListItem>;