type KeyOfRouter = 'loginPath' 
| 'registerPath' 
| 'userInfoPath' 
| 'followPath' 
| 'recordListPath' 
| 'projectListPath' 
| 'skillMgtPath' 
| 'tagMgtPath' 
| 'projectMgtPath' 
| 'recordMgtPath'
| 'navigationPath'
| 'aphorismsPath'
| 'addEditProjectPath'
| 'viewProjectPath'
;

export const routerMap: Record<KeyOfRouter, string> = {
  loginPath: '/login',
  registerPath: '/register',
  userInfoPath: '/user/:id/user-info',
  followPath: '/user/:id/follow',
  recordListPath: '/user/:id/record-list',
  projectListPath: '/user/:id/project-list',
  skillMgtPath: '/user/:id/management-skill',
  tagMgtPath: '/user/:id/management-tag',
  projectMgtPath: '/user/:id/management-project',
  recordMgtPath: '/user/:id/management-record',
  navigationPath: '/user/:id/management-navigation',
  aphorismsPath: '/user/:id/management-aphorisms',
  addEditProjectPath: '/project-detail-edit',
  viewProjectPath: '/project-detail-view',
}

type KeyOfApi = 'loginPath'
| 'registerPath'
| 'skillListPath'
| 'skillAddPath'
| 'skillEditPath'
| 'skillDeletePath'
| 'tagListPath'
| 'tagAddPath'
| 'tagEditPath'
| 'tagDeletePath'
| 'projectListPath'
| 'projectAddPath'
| 'projectEditPath'
| 'projectDeletePath'
| 'recordListPath'
| 'recordAddPath'
| 'recordEditPath'
| 'recordDeletePath'
| 'navgationListPath'
| 'navgationAddPath'
| 'navgationEditPath'
| 'navgationDeletePath'
| 'navgationListCategoryPath'
| 'aphorismsListPath'
| 'aphorismsAddPath'
| 'aphorismsEditPath'
| 'aphorismsDeletePath'
| 'skillStackListPath'
;

export const apiMap: Record<KeyOfApi, string> = {
  loginPath: '/user/login',
  registerPath: '/user/register',
  skillListPath: '/skill/getlist',
  skillAddPath: '/skill/add',
  skillEditPath: '/skill/update',
  skillDeletePath: '/skill/delete',
  skillStackListPath: '/skill/getstacklist',
  tagListPath: '/tag/getlist',
  tagAddPath: '/tag/add',
  tagEditPath: '/tag/update',
  tagDeletePath: '/tag/delete',
  projectListPath: '/project/getlist',
  projectAddPath: '/project/add',
  projectEditPath: '/project/update',
  projectDeletePath: '/project/delete',
  recordListPath: '/record/getlist',
  recordAddPath: '/record/add',
  recordEditPath: '/record/update',
  recordDeletePath: '/record/delete',
  navgationListPath: '/navgation/getlist',
  navgationAddPath: '/navgation/add',
  navgationEditPath: '/navgation/update',
  navgationDeletePath: '/navgation/delete',
  navgationListCategoryPath: '/navgation/getallcategorylist',
  aphorismsListPath: '/aphorisms/getlist',
  aphorismsAddPath: '/aphorisms/add',
  aphorismsEditPath: '/aphorisms/update',
  aphorismsDeletePath: '/aphorisms/delete',
}
