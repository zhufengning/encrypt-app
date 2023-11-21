import { createApp } from 'vue'

import router from "./router"; //添加router


import index from './index.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import { aliases, mdi } from 'vuetify/iconsets/mdi'
const vuetify = createVuetify({
  components,
  directives,

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

var app = createApp(index)
app.use(router)
app.use(vuetify)
app.mount('#app')
