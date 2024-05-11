export type loginType = {
  email: string;
  password: string;
}

export interface userModel {
  account?: string;
  avatar?: string;
  createTime?: string;
  email: string;
  id: number;
}
