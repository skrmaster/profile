export function useClearUserInfoStorage() {
  useState("userInfo", () => null);
  const storge1 = new StorageSuger('localStorage');
  const storge2 = new StorageSuger('sessionStorage');
  storge1.removeValue("userInfo");
  storge2.removeValue("userInfo");
}
