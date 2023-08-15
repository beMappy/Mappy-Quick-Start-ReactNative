import { NativeModules } from 'react-native'

class Map {
  constructor(nativeModule) {
    // explicitly set our custom methods and properties
    this.load = nativeModule.load
  }
}

export default new Map(NativeModules.MappyMap)
