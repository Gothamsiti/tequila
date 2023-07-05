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