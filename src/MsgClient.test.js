import MsgClient from './MsgClient'
import { noop } from './config'

export const mockSend = (data, callback) => {
  callback(200, data)
}

export const mockPubNub = {
  publish: mockSend,
  subscribe: noop,
  signal: mockSend,
  addListener: noop,
}

describe('MsgClient', () => {
  const logs = {}
  const log = data => {
    logs[data.payload.message || 'last'] = data
  }
  const mock = new MsgClient({ pubnub: mockPubNub, log: log })
  const msgs = ['one', 'two', 'three']
  let count = 0

  test('mockSend', () => {
    const msg = 'testing'
    mockSend(msg, (status, data) => {
      expect(status).toBe(200)
      expect(data).toBe(msg)
    })
  })

  test('addHandler', () => {
    expect(mock.addHandler()).toBeFalsy()
    expect(mock.addHandler('noop', noop)).toBeTruthy()
  })

  test('handle', () => {
    msgs.forEach(m => {
      mock.handle(m, () => count++)
      mock.processHandlers({ message: m })
    })
    expect(count).toBe(msgs.length)
  })
  test('stopHandling', () => {
    msgs.forEach(m => {
      mock.handle(m, () => count++)
      mock.processHandlers({ message: m })
    })
    mock.stopHandling(msgs[0])
    count = 0
    msgs.forEach(m => {
      mock.processHandlers({ message: m })
    })

    expect(count).toBe(msgs.length - 1)
  })
  test('send', () => {
    let msg = 'testing send'
    expect(mock.send()).toBeFalsy()
    expect(mock.send('signal', msg)).toBeTruthy()
    expect(logs[msg].payload.message).toBe(msg)

    msg = 'testing publish via send'
    expect(mock.send('publish', msg)).toBeTruthy()
    expect(logs[msg].payload.message).toBe(msg)
  })

  test('signal', () => {
    const msg = 'testing signal'
    mock.signal(msg)
    expect(logs[msg].payload.message).toBe(msg)
  })

  test('publish', () => {
    const msg = 'testing publish'
    mock.publish(msg)
    expect(logs[msg].payload.message).toBe(msg)
  })
})
