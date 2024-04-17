declare type FormConfig = {
  require?: boolean
  field: string
  type: string
  rule?: RegExp | string
  elementConfig: {
    modelValue?: string;
    placeholder?: string;
    autocomplete?: string;
    type?: string;
    width?: string | number;
    clearable?: boolean;
    disable?: boolean;
    readonly?: boolean;
    isError?: boolean;
    errorMsg?: string;
    label?: string;
  }
}

interface Form {
  generateTextInput(config: FormConfig): VNode;
  generateVerificationCode(config: FormConfig): VNode,
  generateNumberInput(config: FormConfig): VNode;
  generateRateInput(config: FormConfig): VNode;
  generateCheckBox(config: FormConfig): VNode;
  generateRadioBox(config: FormConfig): VNode;
  vaildForm(): boolean;
}
