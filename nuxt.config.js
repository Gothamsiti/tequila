// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components : {
    global : true,
    dirs : [
        {
            path : '~/components'
        }
    ]
  },

  buildModules: [
    '@nuxtjs/pwa',
  ],
  pwa: {
    icon: {
      soure: '/images/icons/icons.png',
      sizes: [ 64, 120, 144, 152, 192, 384, 512]
    },
    meta: {
      viewport:'width=device-width, initial-scale=1'
    }
  }, 
  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: '@import "@/assets/scss/vars.scss";\n',
              },
          },
      },
  },
  devtools: { enabled: false },
})