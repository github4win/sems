import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import {BootstrapVue, ModalPlugin} from 'bootstrap-vue'
 import {IconsPlugin} from 'bootstrap-vue'
// import { ModalPlugin } from 'bootstrap-vue' /* bootstrap Modal은 따로 선언을 한다 */
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal' // Modal

//import './assets/less/Main.less'
require('./assets/css/Screen.less') // Screen 반응형 사이즈 Css 구성 파일
require('./assets/css/Style.less') // Style Css 구성 파일
//require('tui-chart/dist/tui-chart.css');  //Chart css구성 파일.\
//require('@toast-ui/vue-chart');  
import 'tui-grid/dist/tui-grid.css';

Vue.config.productionTip = false

Vue.use(VModal, { dynamic: true })
window.$ = window.jQuery = require('jquery');
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ModalPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
