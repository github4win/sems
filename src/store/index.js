import Vue from 'vue'
import Vuex from 'vuex'
import UserInfo from './modules/userinfo'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules:{
        UserInfo : UserInfo
    }
})