type KeyType = 'loginPath' | 
'registerPath' | 
'skillListPath' | 
'skillAddPath' | 
'skillEditPath' | 
'skillDeletePath' |
'userInfoPath' |
'followPath' |
'recordListPath' |
'projectListPath' |
'skillMgtPath';

export const routerMap: Record<KeyType, string> = {
  loginPath: '/user/login',
  registerPath: '/user/register',
  skillListPath: '/skill/getlist',
  skillAddPath: '/skill/add',
  skillEditPath: '/skill/update',
  skillDeletePath: '/skill/delete',
  userInfoPath: '/user/:id/user-info',
  followPath: '/user/:id/follow',
  recordListPath: '/user/:id/record-list',
  projectListPath: '/user/:id/project-list',
  skillMgtPath: '/user/:id/skill-mgt',
}
