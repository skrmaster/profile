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

declare namespace Skill {
  type Skill = {
    name: string;
    mastery: string;
    x: number;
    y: number;
    moveVector: number;
    originX: number;
    originY: number;
    class: string;
    originClass: string;
    id: string;
  }
  
  type SkillName = {
    name: string;
    proficiency: number;
    id: number;
  }
}
