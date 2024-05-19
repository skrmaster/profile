type Operate = "edit" | "delete";
type TableCell = 'edit' | 'delete' | 'cell';

type TableHead = {
  name: string;
  field?: string;
  width?: string;
  class?: string;
  align?: string;
  colWidth?: string;
  operate?: Operate[];
}
