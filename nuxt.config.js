// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: {
    global: true,
    dirs: [
      {
        path: '~/components'
      }
    ]
  },
  head: {
    link: [
      { rel: "manifest", href: "/manifest.json" }
    ]
  },
  vite: {
    optimizeDeps: { exclude: ["fsevents"] },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/vars.scss";\n',
        },
      },
    },
  },
  runtimeConfig: {
    env: process.env.ENVIROMENT,
    api: {
      baseUrl: process.env.API_BASE_URL
    },
    public: {
      env: process.env.ENVIROMENT,
      storyblokVersion: process.env.STORYBLOK_API_VERSION,
      STORYBLOK_KEY: process.env.STORYBLOK_API_KEY,
      baseUrl: process.env.API_BASE_URL
    }
  },

  modules: [
    '@vite-pwa/nuxt',
    // 'dayjs-nuxt',
    // 'nuxt-font-loader',
    // '@nuxt/image-edge',
    [
      '@storyblok/nuxt', {
        accessToken: process.env.STORYBLOK_API_KEY
      }
    ],
    // "@nuxtjs/robots",
    // 'nuxt-simple-sitemap' //https://nuxt.com/modules/simple-sitemap
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Tequila - The Blue Agave stroy',
      short_name: 'Tequila',
      theme_color: '#669999',
      background_color: "#669999",
      icons: [
        {
          "src": "images/icons/icon-72x72.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "images/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  devtools: { enabled: false },
})