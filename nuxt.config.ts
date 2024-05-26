import fs from 'fs'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';

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
        lintOnStart: true,
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
        "module": "ESNext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "jsx": "preserve",
        "jsxImportSource": "vue",
        "noImplicitThis": true,
        "strict": true,
        "verbatimModuleSyntax": true,
        "target": "ESNext",
        "useDefineForClassFields": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true,
        "baseUrl": ".",
        "types": ["@types/node"]
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
    plugins: [
      eslintPlugin({
        lintOnStart: false,
        include: ['src/**/*.ts', 'src/**/*.ts', 'src/**/*.ts'],
        exclude: ['node_modules', 'public', '.nuxt', '.vs', '.vscode']
      }),
      vueJsx()
    ]
  }
});
