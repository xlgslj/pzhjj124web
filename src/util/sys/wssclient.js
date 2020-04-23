import * as path from '../../config/path'
var _clients = []
export default function () {
  this.clients = _clients
  this.socket = null
  this.creatClient = (token) => {
    if (!window.WebSocket) {
      window.WebSocket = window.MozWebSocke
    }
    if (window.WebSocket) {
      // this.socket = new WebSocket('ws://192.168.2.240:8089/' + token)
      this.socket = new WebSocket(path['WSURL'] + token)
      this.socket.onopen = function (event) {
        console.log('连接开启!')
      }
      this.socket.onmessage = function (event) {
        let data = JSON.parse(event.data)
        console.log(data)
        _clients.forEach(item => {
          if (typeof (item) === 'function') {
            item(data)
          }
        })
      }
      this.socket.onclose = function (e) {
        console.log('连接关闭!')
      }
    }
  }
}
