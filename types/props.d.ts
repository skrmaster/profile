declare namespace Layouts {
  interface BgSettingProps {
    bgChangeColor?: boolean;
    bgStyleContent?: string;
    bgDefaultSize?: boolean;
    [key: string]: any;
  }
}

declare namespace DetailTitle {
  type Action = 'submit-tmp' | 'submit';
}

declare namespace Carousel {
  type ImageList = {
    id: string;
    image: string;
  }
}

declare namespace Upload {
  type FileInfoList = {
    fullPath: string;
    id: string;
  }
}
