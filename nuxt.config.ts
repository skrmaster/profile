// eslint-disable-next-line @typescript-eslint/no-var-requires
import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module'
  ],
  eslint: {
    lintOnStart: true,
    cache: false,
  },
  alias: {
    '/#/': fileURLToPath(new URL('./types', import.meta.url))
  },
  devtools: { enabled: false },
  app: {
    head: {
      link: [],
    }
  },
  plugins: [],
  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {
      "compilerOptions": {
        "noEmit": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
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
      },
      include: [
        "types/*.d.ts"
      ],
    }
  },
  vite: {
    mode: "development",
    root: "./"
  }
})
