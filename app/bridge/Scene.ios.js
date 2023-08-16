import { NativeModules } from 'react-native'

class Scene {
  constructor(nativeModule) {
    // explicitly set our custom methods and properties
    this.load = nativeModule.load
  }
}

export default new Scene(NativeModules.MappyScene)
