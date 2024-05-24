type Operate = 'view' | 'edit' | 'delete';
type TableCell = 'view' | 'edit' | 'delete' | 'cell';
type Fixed = 'right' | 'left'

type TableHead = {
  name: string;
  field?: string;
  width?: string;
  class?: string;
  align?: string;
  fixed?: Fixed;
  colWidth?: string;
  operate?: Operate[];
  type?: 'cell' | 'div';
  slotName?: string;
}
