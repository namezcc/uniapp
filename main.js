import uvUI from '@/uni_modules/uv-ui-tools'
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store'
// Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.use(uvUI);
App.mpType = 'app'

const app = new Vue({
    ...App
})

// Vue.config.errorHandler = function (err,vm,info) {
// 	const errinfo = {
// 		err:err.message,
// 		vm:vm.$vnode.tag,
// 		info:info,
// 	}
	
// 	const errstr = JSON.stringify(errinfo)
// 	console.log("geterror:",errstr)
// }

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(uvUI);
  
  
  // app.config.errorHandler = function (err,vm,info) {
  // 	const errinfo = {
  // 		err:err.message,
  // 		// vm:vm.$vnode.tag,
		// stack:err.stack,
  // 		info:info,
  // 	}
  	
  // 	const errstr = JSON.stringify(errinfo)
  // 	console.log("geterror:",errstr)
  // }
  
  
  return {
    app
  }
}
// #endif