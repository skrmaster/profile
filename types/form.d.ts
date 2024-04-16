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
  }
}

interface Form {
  generateTextInput(config: FormConfig, vaild?: boolean): VNode;
  generateVerificationCode(config: FormConfig, vaild?: boolean): VNode,
  generateNumberInput(): void;
  generateRateInput(): void;
  generateCheckBox(): void;
  generateRadioBox(): void;
  vaildForm(): boolean;
}
