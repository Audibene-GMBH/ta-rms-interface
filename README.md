# ta-rms-interface
Simplifies RMS communication for the client

## Install
```
$ npm install ta-rms-interface
```

## usage

```javascript
import MsgClient from 'ta-rms-interface'

class VirtualTablet extends MsgClient {
  startCustomerVideo = () => this.signal(eventTypes.startCustomerVideo)
  stopCustomerVideo = () => this.signal(eventTypes.stopCustomerVideo)
}
  ...
```

