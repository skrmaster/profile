import fs from "fs";
import path from "path";

const cssDir = path.resolve(__dirname, "assets/css");
const cssFiles = fs.readdirSync(cssDir).filter((file) => file.endsWith(".css"));
const mode = process.env.NODE_ENV;
const { app } = useRuntimeConfig();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    [
      //https://nuxt.com/modules/eslint-module
      "@nuxtjs/eslint-module",
      {
        lintOnStart: false,
        cache: true,
      },
    ],
    "dayjs-nuxt",
    [
      "@nuxtjs/robots",
      {
        UserAgent: "*",
        Disallow: "/admin",
        Sitemap: "",
      },
    ],
  ],

  css: cssFiles.map((file) => `~/assets/css/${file}`),
  alias: {},
  devtools: { enabled: mode === "development" },

  app: {
    head: {
      htmlAttrs: {
        lang: "zh-cn",
      },
      link: [
        {
          rel: "icon",
          href: `${app.baseURL}favicon.ico`,
        },
      ],
      script: [
        {
          type: "module",
          src: `${app.baseURL}iconfont/iconfont.js`,
        },
      ],
    },
  },

  plugins: [
    "~/plugins/prism.ts", // 引入插件
  ],

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("three")) {
              return "three";
            }
          },
        },
      },
    },
  },

  typescript: {
    builder: "vite",
    typeCheck: true,
    strict: true,
    tsConfig: {
      compilerOptions: {
        allowJs: true,
        noEmit: true,
        noImplicitAny: true,
        module: "es2022",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        jsx: "preserve",
        lib: ["dom", "dom.iterable", "esnext", "webworker"],
        jsxImportSource: "vue",
        noImplicitThis: true,
        strict: true,
        verbatimModuleSyntax: true,
        target: "es2022",
        useDefineForClassFields: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        baseUrl: ".",
        typeRoots: ["./node_modules/@types", "./types"],
      },
      include: [
        "lib/*.d.ts",
        "lib/**/*.d.ts",
        "types/*.d.ts",
        "types/**/*.d.ts",
        "src/*.d.ts",
        "src/**/*.d.ts",
      ],
      exclude: ["node_modules", ".nuxt", ".output"],
    },
  },

  nitro: {
    preset: "node-server",
  },

  compatibilityDate: "2024-08-31",
});
