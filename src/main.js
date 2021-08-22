import { createApp } from 'vue'
import 'lib-flexible/flexible'
import registerVant from './utils/vant'
import App from './App.vue'
import router from './router'
import store from './store'


let app = createApp(App).use(store).use(router)
registerVant(app)
app.mount('#app')
