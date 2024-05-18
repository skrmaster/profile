declare type FormConfig = {
  require?: boolean;
  field: string;
  type: string;
  rule?: RegExp | string;
  data?: any;
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
    maxLength?: number;
    minLength?: number;
    rows?: number;
  }
}

type FormEditAddType = 'add' | 'edit';

interface Form {
  generateTextInput(config: FormConfig): VNode;
  generateVerificationCode(config: FormConfig): VNode,
  generateNumberInput(config: FormConfig): VNode;
  generateRateInput(config: FormConfig): VNode;
  generateCheckBox(config: FormConfig): VNode;
  generateRadioBox(config: FormConfig): VNode;
  vaildForm(): boolean;
}

declare type ReturnVaildForm = {
  vaild: boolean;
  data: Record<string, any>
}
