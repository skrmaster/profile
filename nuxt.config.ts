import vueJsx from '@vitejs/plugin-vue-jsx';

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
        "types/*.d.ts",
        "types/**/*.d.ts",
        "src/**/*.d.ts",
        "src/*.d.ts",
        "@types/**/*.d.ts",
        "./**/*.tsx", 
        "./nuxt.config.ts"
      ],
      "exclude": ["node_modules"]
    }
  },
  vite: {
    plugins: [vueJsx()]
  }
})
