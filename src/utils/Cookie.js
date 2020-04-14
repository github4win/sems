import Cookies from 'js-cookie'
import Vue from 'vue'
import vue_Cookie from 'vue-cookies'

//const TokenKey = 'Token'
Vue.use(vue_Cookie, '1y')

export function SetCookies(Key, Value) {
    return this.$cookies.set(Key, Value)
}

export function GetCookies(Key) {
    return this.$cookies.get(Key)
}

export function RemoveCookies(Key) {
    return this.$cookies.remove(Key)
}

export function getToken(TokenKey) {
    return Cookies.get(TokenKey)
}

export function setToken(TokenKey, token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
    return Cookies.remove(TokenKey)
}