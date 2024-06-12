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
  codeId: string;
}

export type UpdatePwd = {
  email: string;
  password: string;
  code: string;
  codeId: string;
}

export type UpdateInfo = {
  account: string;
  email: string;
  password: string;
  code: string;
  originEmail: string;
  codeId: string;
} & Partial<UserModel>

export interface UserModel {
  account?: string;
  avatar?: string;
  createTime?: string;
  email: string;
  id: number;
  permission?: string;
}
