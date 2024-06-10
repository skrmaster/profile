export type LoginType = {
  email: string;
  password: string;
  isRemember: boolean;
}

export type Register = {
  account: string;
  email: string;
  password: string;
  code: string;
}

export type UpdatePwd = {
  email: string;
  originPassword: string;
  password: string;
  code: string;
}

export type UpdateInfo = {
  account: string;
  email: string;
  password: string;
  code: string;
} & Partial<UserModel>

export interface UserModel {
  account?: string;
  avatar?: string;
  createTime?: string;
  email: string;
  id: number;
  permission?: string;
}
