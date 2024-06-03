import fs from 'fs';
import path from 'path';

const cssDir = path.resolve(__dirname, 'assets/css')
const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'))
const mode = process.env.NODE_ENV;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    [
      //https://nuxt.com/modules/eslint-module
      '@nuxtjs/eslint-module', 
      { 
        lintOnStart: false,
        cache: true
      }
    ],
    'dayjs-nuxt'
  ],
  css: cssFiles.map(file => `~/assets/css/${file}`),
  alias: {},
  devtools: { enabled: mode === 'development' },
  app: {
    head: {
      htmlAttrs: {
        lang: "en-us"
      },
      link: [],
      script: [
        {
          type: 'module',
          src: '/js/iconfont.js'
        }
      ]
    }
  },
  plugins: [],
  typescript: {
    builder: 'vite',
    typeCheck: true,
    strict: true,
    tsConfig: {
      "compilerOptions": {
        "allowJs": true,
        "noEmit": true,
        "noImplicitAny": true,
        "module": "es2022",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "jsx": "preserve",
        "jsxImportSource": "vue",
        "noImplicitThis": true,
        "strict": true,
        "verbatimModuleSyntax": true,
        "target": "es2022",
        "useDefineForClassFields": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true,
        "baseUrl": ".",
        "typeRoots": [
          "./node_modules/@types",
          "./types"
        ]
      },
      "include": [
        "lib/*.d.ts",
        "lib/**/*.d.ts",
        "types/*.d.ts",
        "types/**/*.d.ts",
        "src/*.d.ts",
        "src/**/*.d.ts"
      ],
      "exclude": ["node_modules"],
    }
  },
  vite: {
  }
});
