import * as axios from './axios'
import * as path from '../../router/paths'
/*
export function login (params) {
  return new Promise((resolve, reject) => {
    axios._axios.get(path.LOGIN, {params}).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}*/

export function call (app, method, params) {
  if (method === 'get') {
    Object.assign(params, {tiemstamp: (new Date()).getTime()}) // ie11会缓存,加一个时间戳
    return new Promise((resolve, reject) => {
      axios._axios.get(app, {params}).then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
        .catch((error) => {
          reject(error)
        })
    })
  } else {
    return new Promise((resolve, reject) => {
      axios._axios.post(app, params).then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export function login1 (params) {
  return new Promise((resolve, reject) => {
    resolve('xlgsj')
  })
}
