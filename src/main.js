import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {postKayValueRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {initMenu} from "./utils/menus";

Vue.use(ElementUI, {size: 'small'});
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.postKayValueRequest = postKayValueRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.postRequest = postRequest;


router.beforeEach((to, from, next) => {
    if (to.path === "/") {
        next();
    } else {
        console.log("user:" + window.sessionStorage.getItem("user"));
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            console.log('跳转');
            next("/?redirect=" + to.path);
        }
    }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//const router = new VueRouter({ ... })


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
