const baseURL = process.env.BASE_URL || 'http://localhost:8000/api'
console.log('baseURL', baseURL)

export default {
  srcDir: 'src',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Glide AI',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/main.scss', 
    '~/assets/fonts/main.css',
    './vue-chat-bot-custom/dist/vue-chat-bot.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/global' },
    { src: '~/plugins/vue-chat-bot', mode: 'client' },
    { src: '~/plugins/accessor' },
    { src: '~/plugins/persistedState'},
    { src: '~/plugins/vue2-transitions'},
    { src: '~/plugins/vue-awesome-countdown'},
    { src: '~/plugins/font-awesome'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    "@nuxtjs/moment",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'defu'
    ]
  },

  axios: {
    baseURL: baseURL
  },

  auth: {
    redirect: {
      home: false,
      callback: `/login`,
      logout: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'access_token',
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/auth/signin', method: 'post' },
          logout: { url: '/auth/signout', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
        },
        tokenType: 'Bearer',
        tokenName: 'Authorization'
      },
    }
  },

  transpileDependencies: [
    'vuex-module-decorators'
  ],

  moment: {
    defaultTimezone: 'Asia/Seoul',
    locales: ['ko'],
    plugins: [
      'moment-duration-format',
    ],
  },
}
