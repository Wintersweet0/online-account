import axios from 'axios'
import { Toast, Notify } from "vant";
const loadingIcon = require("@/assets/images/loading.gif");
let service = axios.create({
  baseURL: '',
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    if(!config.loading){
      Toast.loading({
        icon: loadingIcon,
        duration: 0,
        forbidClick: true,
        message: "",
        className: "loading-icon"
      })
    }
    return config
  },
  (error) => {
    Toast.clear();
    Promise.reject(error);
  }
)

service.interceptors.response.use(
  (response) => {
    // console.log('response', response);
    Toast.clear();
    const { data } = response;
    if(typeof data !== 'object'){
      Notify({type: "danger", message: "服务端错误"})
      return Promise.reject(data)
    }
    if(data.code != 200){
      if(data.msg){
        Toast.fail(data.msg)
        //接下来写未登录怎么办
        // if (data.code == 401) {
        //   //未登录
        //   router.push("/login");
        //   return;
        // }
      }
    }
    if(data.code == 200){
      return Promise.resolve(data)
    }
  },
  (error) => {
    Toast.clear();
    return Promise.reject(error);
  }
)

export function post(url, ...config){
  // console.log('config', config);
  return service.post(url, ...config)
}

export function put(url, ...config){
  // console.log('config', config);
  return service.put(url, ...config)
}

export function del(url, params, ...config){
  // console.log('config', config);
  return service.delete(url, {
      params,
      ...config
    }
  )
}

export function get(url, params, ...config){
  // console.log('params', params);
  return service.get(url, {
      params,
      ...config
    }
  )
}