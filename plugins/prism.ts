// 富文本代码高亮配置
// plugins/prism.ts
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css'; // 或其他你喜欢的主题

// 手动导入需要的语言支持
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-cshtml';
import 'prismjs/components/prism-csharp';
// ... 导入其他你需要的语言

export default defineNuxtPlugin(() => {
  return {
    provide: {
      prism: Prism
    }
  }
});
