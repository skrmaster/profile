export const options = {
  tagList: [
    {
      label: '技术栈',
      value: '1'
    },
    {
      label: '其他',
      value: '2'
    }
  ],
}

export function getListLabel(value: string, list: Array<LabelValue>): string | undefined {
  const item = list.find(e => e.value == value);
  return item ? item.label : item;
}

export function getListValue(label: string, list: Array<LabelValue>): string | undefined {
  const item = list.find(e => e.label == label);
  return item ? item.value : item;
}
