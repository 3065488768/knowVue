let Socket = null
let setIntervalWesocketPush = null
const socketUrl = 'ws://localhost:9527/api/websocket/'  // socket连接地址
/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = (userId) => {
    Socket && Socket.close()
    if (!Socket) {
        console.log('尝试websocket连接')
        let userid = userId;// 这里我是为了获取登录的用户信息
        if (userid) {
            Socket = new WebSocket(socketUrl + userid)
            Socket.onopen = onopenWS
            Socket.onmessage = onmessageWS
            Socket.onerror = onerrorWS
            Socket.onclose = oncloseWS
            console.log("连接成功")
        } else {
            console.log("用户未登录")
        }
    } else {
        console.log('websocket已连接')
    }
}

/**打开WS之后发送心跳 */
const onopenWS = () => {
    // sendPing()
}

/**连接失败重连 */
const onerrorWS = () => {
    Socket.close()
    clearInterval(setIntervalWesocketPush)
    console.log('连接失败重连中')
    if (Socket.readyState !== 3) {
        Socket = null
        createSocket(socketUrl)
    }
}

/**WS数据接收统一处理 */
const onmessageWS = e => {
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e.data
        }
    })) 
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
    setTimeout(() => {
        if (Socket.readyState === 0) {
            connecting(message)
        } else {
            Socket.send(JSON.stringify(message))
        }
    }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
    if (Socket !== null && Socket.readyState === 3) {
        Socket.close()
        createSocket(socketUrl)
    } else if (Socket.readyState === 1) {
        Socket.send(JSON.stringify(message))
    } else if (Socket.readyState === 0) {
        connecting(message)
    }
}


/**断开重连 */
const oncloseWS = () => {
    console.log('websocket已断开')
    // Socket = null
    clearInterval(setIntervalWesocketPush)
    console.log('websocket已断开....正在尝试重连')
    if (Socket.readyState !== 2) {
      Socket = null
      createSocket()
    }
}

export const closeWs = () => {
    Socket.close()
}


/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 5000, ping = 'ping') => {
    clearInterval(setIntervalWesocketPush)
    Socket.send(JSON.stringify({ "event": "heart" }))
    setIntervalWesocketPush = setInterval(() => {
        Socket.send(JSON.stringify({ "event": "heart" }))
    }, time)
}