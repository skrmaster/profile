type KeyType = 'loginPath' | 
'registerPath' | 
'skillList' | 
'skillAdd' | 
'skillEdit' | 
'skillDelete';

export const routerMap: Record<KeyType, string> = {
  loginPath: '/user/login',
  registerPath: '/user/register',
  skillList: '/skill/getlist',
  skillAdd: '/skill/add',
  skillEdit: '/skill/update',
  skillDelete: '/skill/delete',
}
