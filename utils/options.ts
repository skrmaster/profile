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
  addressNavigationList: [
    {
      label: '动漫',
      value: '0'
    },
    {
      label: '漫画',
      value: '1'
    },
    {
      label: '影视',
      value: '2'
    },
    {
      label: '小说',
      value: '3'
    },
    {
      label: '游戏',
      value: '4'
    }
  ],
  recordCategory: [
    {
      label: '原创',
      value: '1',
    },
    {
      label: '转载',
      value: '2'
    }
  ],
  projectRecordtatus: [
    {
      label: '草稿',
      value: '0',
    },
    {
      label: '已发布',
      value: '1'
    }
  ]
}

export function getListLabel(value: string | undefined, list: Array<LabelValue>): string | undefined {
  if (!value) {
    return;
  }
  const item = list.find(e => e.value == value);
  return item ? item.label : item;
}

export function getListValue(label: string | undefined, list: Array<LabelValue>): string | undefined {
  if (!label) {
    return;
  }
  const item = list.find(e => e.label == label);
  return item ? item.value : item;
}
