export function getOffset(el: HTMLElement) {
  const offset = { top: 0, left: 0 };
  while (el) {
    offset.top += el.offsetTop;
    offset.left += el.offsetLeft;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
}
