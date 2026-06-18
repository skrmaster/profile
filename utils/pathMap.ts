type KeyOfRouter =
  | "homePath"
  | "projectPagePath"
  | "recordPagePath"
  | "addressListPath"
  // | "loginPath"
  // | "registerPath"
  // | "userInfoPath"
  // | "followPath"
  // | "recordListPath"
  // | "projectListPath"
  // | "skillMgtPath"
  // | "tagMgtPath"
  // | "projectMgtPath"
  // | "recordMgtPath"
  // | "navigationPath"
  // | "navigationCategoryPath"
  // | "aphorismsPath"
  // | "userMessagePath"
  | "projectDetailPath"
  | "recordDetailPath"
  | "recordPaegPathCopy"
  | "noAuthPath"
  | "searchedPath";

export const routerMap: Record<KeyOfRouter, string> = {
  // loginPath: "/",
  // registerPath: "/signup",
  // userInfoPath: "/user/:id/user-info",
  // followPath: "/user/:id/follow",
  // recordListPath: "/user/:id/record-list",
  // projectListPath: "/user/:id/project-list",
  // skillMgtPath: "/user/:id/management-skill",
  // tagMgtPath: "/user/:id/management-tag",
  // projectMgtPath: "/user/:id/management-project",
  // recordMgtPath: "/user/:id/management-record",
  // navigationPath: "/user/:id/management-navigation",
  // navigationCategoryPath: "/user/:id/management-category",
  // aphorismsPath: "/user/:id/management-aphorisms",
  // userMessagePath: "/user/:id/management-message",
  projectDetailPath: "/project-detail",
  recordDetailPath: "/record-detail",
  homePath: "/",
  addressListPath: "/address-list",
  projectPagePath: "/project-list",
  recordPagePath: "/record-list",
  recordPaegPathCopy: "/record-list-1",
  noAuthPath: "/not-authorized",
  searchedPath: "/searched",
};

type KeyOfApi =
  | "loginPath"
  | "registerPath"
  | "userInfoPath"
  | "userUpdatePath"
  | "userLogoutPath"
  | "userCheckMailPath"
  | "sendMailPath"
  | "skillListPath"
  | "skillAddPath"
  | "skillEditPath"
  | "skillDeletePath"
  | "tagListPath"
  | "tagAddPath"
  | "tagEditPath"
  | "tagDeletePath"
  | "projectGetPath"
  | "projectListPath"
  | "projectAddPath"
  | "projectEditPath"
  | "projectDeletePath"
  | "recordGetInfoPath"
  | "recordListPath"
  | "recordQueryListPath"
  | "recordAddPath"
  | "recordEditPath"
  | "recordRankListPath"
  | "recordDeletePath"
  | "recordCollectionListPath"
  | "recordCountPath"
  | "recordAnonymousViewPath"
  | "navigationGetIconPath"
  | "navigationListPath"
  | "navigationAddPath"
  | "navigationEditPath"
  | "navigationDeletePath"
  | "navigationListCategoryPath"
  | "navigationCategoryAddPath"
  | "navigationCategoryOptionPath"
  | "navigationCategoryUpdatePath"
  | "navigationCategoryDeletePath"
  | "navigationCategoryListPath"
  | "aphorismsListPath"
  | "aphorismsRandomPath"
  | "aphorismsAddPath"
  | "aphorismsEditPath"
  | "aphorismsDeletePath"
  | "messageAddPath"
  | "messageGetList"
  | "skillStackListPath"
  | "uploadSingleFilePath"
  | "deleteSingleFilePath";

export const apiMap: Record<KeyOfApi, string> = {
  loginPath: "/user/login",
  registerPath: "/user/register",
  userInfoPath: "/user/getuserinfo",
  userUpdatePath: "/user/update",
  userLogoutPath: "/user/logout",
  userCheckMailPath: "/user/checkemailhasuse",
  sendMailPath: "/user/sendmail",
  skillListPath: "/skill/getlist",
  skillAddPath: "/skill/add",
  skillEditPath: "/skill/update",
  skillDeletePath: "/skill/delete",
  skillStackListPath: "/skill/getstacklist",
  tagListPath: "/tag/getlist",
  tagAddPath: "/tag/add",
  tagEditPath: "/tag/update",
  tagDeletePath: "/tag/delete",
  projectGetPath: "/project/get",
  projectListPath: "/project/getlist",
  projectAddPath: "/project/add",
  projectEditPath: "/project/update",
  projectDeletePath: "/project/delete",
  recordGetInfoPath: "/record/get",
  recordRankListPath: "/record/getranklist",
  recordListPath: "/record/getlist",
  recordAddPath: "/record/add",
  recordEditPath: "/record/update",
  recordCollectionListPath: "/record/getcollectionlist",
  recordCountPath: "/record/recordcount",
  recordDeletePath: "/record/delete",
  recordAnonymousViewPath: "/record/recordviewcount",
  navigationGetIconPath: "/navgation/geticonfromwebsite",
  navigationListPath: "/navgation/getlist",
  navigationAddPath: "/navgation/add",
  navigationEditPath: "/navgation/update",
  navigationDeletePath: "/navgation/delete",
  navigationListCategoryPath: "/navgation/getallcategorylist",
  navigationCategoryAddPath: "/category/add",
  navigationCategoryOptionPath: "/category/options",
  navigationCategoryUpdatePath: "/category/update",
  navigationCategoryDeletePath: "/category/delete",
  navigationCategoryListPath: "/category/getpaginationlist",
  aphorismsListPath: "/aphorisms/getlist",
  aphorismsRandomPath: "/aphorisms/getrandomaphorisms",
  aphorismsAddPath: "/aphorisms/add",
  aphorismsEditPath: "/aphorisms/update",
  aphorismsDeletePath: "/aphorisms/delete",
  uploadSingleFilePath: "/file/upload",
  deleteSingleFilePath: "/file/delete",
  recordQueryListPath: "/record/getlistbyquery",
  messageAddPath: "/usermessage/add",
  messageGetList: "/usermessage/getlist",
};
