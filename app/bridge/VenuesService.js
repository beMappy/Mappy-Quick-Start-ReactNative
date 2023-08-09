import { NativeModules } from 'react-native'

class VenuesService {
  constructor(nativeModule) {
    // explicitly set our custom methods and properties
    this.getVenues = nativeModule.getVenues
  }
}

export default new VenuesService(NativeModules.MappyVenuesService)
