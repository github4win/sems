import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '../store'
import envs from '@/envs'

let baseUrl = envs.buildUrl
console.log('baseUrl ',baseUrl)
let errNotice = true
let useAuth = true

//console.log(process.env.NODE_ENV)

// axios를 셋팅
if (process.env.NODE_ENV === 'development') {
    // 개발 환경일 경우 API위치를 셋팅한 곳으로 정의한다.
    baseUrl = envs.buildUrl 

}

const service = axios.create({
    baseURL: baseUrl,
    timeout: 300000 // timeout은 5초로 설정 -> 10초로 수정
})

// axios의 reqeust 인터셉터 진행 부
service.interceptors.request.use(

    
    config => {
        // 호출하는 해더 등 config 처리 부분에 정의를 하기 위해서는 이곳에서 처리
        // 차후 토큰 등 인증 정보를 넣어야 하면 이곳에 정의
        // if (store.getters.token) {
        //   config.headers['X-Token'] = getToken()
        // }

        // request에서 meta 정의한 값이 있을 경우
        if (config.meta) {
            // 에러 메시지를 출력하는 여부, 기본은 true
            if (config.meta.useErrorMessage === false) errNotice = false
                // 401 체크 여부, 기본은 true
            if (config.meta.useAuth === false) useAuth = false
        }
        return config
    },
    error => {
        // 에러가 날경우 진행 부분
        // console.log(error) // for debug
        Promise.reject(error)
    }
)

// axios의 response 인터셉터
service.interceptors.response.use(
    
    response => {
        let res = {}
            // console.log('[UI Framework api res]', response)
            // axios를 통해 response 내역 중 data에 서버에서 response된 값이 들어온다.
        if (response.data && response.data.parameter) {
            res = response.data.parameter
        } else {
            res = response.data
        }
        if (response.data && response.data.result) {
            if (typeof res === 'object') res.result = response.data.result
        }
        
        return JSON.parse(res)
    },
    error => {
        //console.log('err', error, error.message, error.response) // for debug
        var msg = error.message
            // error.response가 없을 경우도 존재 - Network 문제
        if (error.response && useAuth && error.response.status === 401) {
            // 401 에러
            msg = '세션이 만료되었거나, 로그인이 실패되었습니다.'
                // 남아 있는 세션 제거
            store.dispatch('ClearSession')
                // login 페이지로 이동
            router.push('/login')
        }
        // 에러 출력이 가용할 경우
        if (errNotice) {
            Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export default service