import type { userModel } from '~/api/user/model';
 
export type AddModel = {
  title: string;
  content?: string;
  tags?: string;
  status?: number | string;
  category: string;
  description?: string;
  coverImageUrl?: string;
  subtitle?: string;
}

export type EditModel = AddModel & {
  id: string;
  [key: string]: any;
}

export type ListItem = EditModel & {
  author: userModel;
  like: number;
  disLike: number;
  view: number;
  isCollection: boolean;
  isDisLike: boolean;
  isLike: boolean;
  collection: number;
  createTime: string;
  updateTime?: string;
}

export type QueryParam = Omit<Pagination, 'total'> & {
  title: string;
}

export type List = Array<ListItem>;

export type CountParam = {
  category: number;
  recordId: string;
}
