const { configure } = require('quasar/wrappers')
require('dotenv').config()

module.exports = configure(function (ctx) {
  return {
    // Boot files
    boot: [
      'vuelidate',
      'ccComponents',
      'axios',
      'socket'
    ],

    // CSS files
    css: [
      'app.sass'
    ],

    // Quasar extras
    extras: [
      'mdi-v5',
      'roboto-font',
      'material-icons'
    ],

    // Build configuration
    build: {
      env: {
        VUE_URL_API: process.env.VUE_URL_API
      },
      vueRouterMode: 'hash',
      
      // Source maps
      devtool: 'source-map',
      
      // Vite specific options
      vitePlugins: [
        ['@vitejs/plugin-vue', {
          template: {
            compilerOptions: {
              isCustomElement: tag => tag.startsWith('ion-')
            }
          }
        }]
      ]
    },

    // Dev server configuration
    devServer: {
      https: false,
      open: true,
      port: 8080
    },

    // Framework configuration
    framework: {
      config: {
        dark: false,
        notify: {},
        loading: {}
      },

      plugins: [
        'Notify',
        'Dialog',
        'LocalStorage',
        'Loading'
      ],

      iconSet: 'material-icons',
      lang: 'pt-br',

      directives: [
        'Ripple',
        'ClosePopup'
      ]
    },

    // Animations configuration
    animations: 'all',

    // SSR configuration
    ssr: {
      pwa: false
    },

    // PWA configuration
    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      workboxOptions: {
        maximumFileSizeToCacheInBytes: 5000000
      },
      manifest: {
        name: 'FlowDeskPro',
        short_name: 'FlowDeskPro',
        description: 'Bot Multi-atendimento para whatsapp',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Electron configuration
    electron: {
      bundler: 'builder',
      builder: {
        appId: 'FlowDeskPro'
      },
      nodeIntegration: true
    }
  }
})
