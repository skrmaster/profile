declare type FormConfig = {
  require?: boolean
  field: string
  type: string
  rule?: RegExp | string
  elementConfig?: {
    modelValue?: string;
    placeholder?: string;
    autocomplete?: string;
    type?: string;
    width?: string | number;
    clearable?: boolean;
    disable?: boolean;
    readonly?: boolean;
    isError?: boolean;
  }
}