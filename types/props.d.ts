declare namespace Layouts {
  interface BgSettingProps {
    bgChangeColor?: boolean;
    bgStyleContent?: string;
    bgDefaultSize?: boolean;
    [key: string]: any;
  }
}

declare namespace DetailTitle {
  type Action = 'submit-tmp' | 'submit' | 'submit-edit';
  type Mode = 'add' | 'edit' | 'view'
}

declare namespace Carousel {
  type ImageList = {
    id: string;
    image: string;
  }
}

declare namespace Upload {
  type FileInfo = {
    fullPath: string;
    id: string;
  }
}
