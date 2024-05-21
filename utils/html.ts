/**
 * @description 递归获取元素的offset信息
 * @param el 元素
 * @returns 
 */
export function getOffset(el: HTMLElement) {
  const offset = { top: 0, left: 0 };
  while (el) {
    offset.top += el.offsetTop;
    offset.left += el.offsetLeft;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
}

/**
 * @description 通过id删除文档Dom元素
 * @param id 元素id
 * @returns
 */
export function removeElementById(id: string): boolean {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    return true;
  } else {
    return false;
  }
}

export function hasVerticalScrollbar(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight;
}

export function hasHorizontalScrollbar(element: HTMLElement): boolean {
  return element.scrollWidth > element.clientWidth;
}
