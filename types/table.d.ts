type Operate = "edit" | "delete";

type TableHead = {
  name: string;
  field?: string;
  width?: string;
  class?: string;
  align?: string;
  operate?: Operate[];
}
