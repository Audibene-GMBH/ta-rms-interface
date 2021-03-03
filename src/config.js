export const log = console.log

// eslint-disable-next-line no-console
// export const log = console.log

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
const cockpit = { env: process.env }

const pubnub = {
  publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
  uuid: 'replace with fitting.fitter.id',
}

const config = { cockpit, log, pubnub }
export default config
