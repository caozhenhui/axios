import axios from 'axios'

// 创建axios实例
const $axios = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// axios 提供了请求拦截和响应拦截的接口，每次请求都会调用startLoading方法，每次响应都会调用endLoading方法

// startLoading endLoading要干的事儿就是将同一时刻的请求合并。声明一个变量reqNum，每次调用startLoading方法 reqNum + 1。调用endLoading()方法，reqNum - 1。reqNum为 0 时，结束 loading

let reqNum = 0

function startLoading () {
  if (reqNum === 0) {
    console.log('开始loading')
  }
  reqNum++
}

function endLoading () {
  // 延迟 300ms 再调用 closeLoading 方法, 合并300ms内的请求
  // setTimeout(closeLoading, 300)
  closeLoading()
}

function closeLoading () {
  if (reqNum <= 0) return
  reqNum--
  if (reqNum === 0) {
    console.log('结束loading')
  }
}

// 请求拦截器
$axios.interceptors.request.use(config => {
  // 如果某个请求不需要 loading 呢，那么发请求的时候加个 showLoading： false的参数就好了。在请求拦截和响应拦截时判断下该请求是否需要loading，需要 loading 再去调用startLoading()方法即可
  // 自定义header信息（比如token）
  // config.headers['Token'] =
  startLoading()
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
$axios.interceptors.response.use(response => {
  endLoading()
  return response
}, (error) => {
  // 公共错误判断
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 404:
  //       console.log('找不到页面'); break
  //     case 500:
  //       console.log('服务器错误'); break
  //     default: break
  //   }
  // }
  // 结束loading
  endLoading()
  return Promise.reject(error)
})

export default {
  post: (url, data, headers) => $axios.post(url, data, { headers }),
  get: (url, data, headers) => {
    // get请求防止IE缓存
    let t = new Date().getTime()
    data.t = t
    return $axios.get(url, {
      params: data,
      headers
    })
  }
}
