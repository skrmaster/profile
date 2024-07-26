type FormConfig = {
  require?: boolean;
  field: string;
  type: 'select' | 'verification-code' | 'checkbox' | 'text' | 'textarea' | 'password' | 'number' | 'switch' | 'radio' | 'upload';
  rule?: RegExp | string;
  data?: any;
  elementConfig: {
    layout?: 'column' | 'inline';
    activeLabel?: string;
    inActiveLabel?: string;
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
    optionList?: Array<LabelValue>;
    fileList?: Array<Upload.FileInfo>;
    limit?: number;
  }
}

type FormEditAdd = 'add' | 'edit';

interface Form {
  generateTextInput(config: FormConfig): VNode;
  generateVerificationCode(config: FormConfig): VNode,
  generateNumberInput(config: FormConfig): VNode;
  generateRateInput(config: FormConfig): VNode;
  generateCheckBox(config: FormConfig): VNode;
  generateRadioBox(config: FormConfig): VNode;
  generateSelect(config: FormConfig): VNode;
  generateSwitch(config: FormConfig): VNode;
  generateUploadFile(config: FormConfig): VNode;
  vaildForm(): boolean;
}

type ReturnVaildForm = {
  vaild: boolean;
  data: Record<string, any>
}
