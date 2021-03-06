import PubNub from 'pubnub'
import config, { noop } from './config'

let log = config.log || noop // can be overloaded by props below

export class MsgClient {
  constructor(props) {
    props = props || {}
    log = props.log || log
    this.pubnub = props.pubnub || new PubNub(config.pubnub)

    //https://www.pubnub.com/docs/platform/first-steps/setup
    this.addHandler(props.callback)
    this.addHandler(this.processHandlers)

    this.channel = props.channel || config.channel || 'default'
    this.pubnub.subscribe({
      channels: [this.channel], // just one channel - the fitting.id
    })
  }

  addHandler(callback) {
    if (!callback) return false
    this.pubnub.addListener({
      message: payload => {
        if (payload.publisher === config.pubnub.uuid) return // I sent it, ignore it
        log({ pubnub: 'received', message: payload.message, payload })
        callback(payload)
      },
      signal: payload => {
        if (payload.publisher === config.pubnub.uuid) return // I sent it, ignore it
        log({ pubnub: 'received', signal: payload.message, payload })
        callback(payload)
      },
    })
    return true
  }

  handlers = {} // map messages to callback functions
  processHandlers(payload){
    const { message } = payload
    this.handlers[message] && this.handlers[message](payload)
  }

  handle(message, handler){
    this.handlers[message] = handler
  }

  stopHandling(message){
    delete this.handlers[message]
  }

  // https://www.pubnub.com/docs/first-steps/setup#add-a-listener

  send(func, msg){
    if (typeof this.pubnub[func] != 'function') return false

    const payload = {
      channel: this.channel,
      message: msg,
    }

    this.pubnub[func](payload, (status, response) => {
      log({ pubnub: func, message: payload.message, payload, status, response })
    })
    return true
  }

  publish(msg){
    return this.send('publish', msg)
  }
  signal(msg){
    return this.send('signal', msg)
  }
}


