import { NativeModules } from 'react-native'

class MappyCore {
  constructor(nativeModule) {
    // explicitly set our custom methods and properties
    this.initialize = nativeModule.initialize
  }
}

export default new MappyCore(NativeModules.MappyCore)
