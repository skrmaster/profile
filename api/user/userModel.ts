export type loginType = {
  email: string;
  password: string;
}

export type registerType = {
  email: string;
  password: string;
  code: string;
}

export interface userModel {
  account?: string;
  avatar?: string;
  createTime?: string;
  email: string;
  id: number;
}
