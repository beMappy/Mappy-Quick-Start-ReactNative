import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.snowmappyrn.RNViewModel

class MappyBridge(val reactContext: ReactApplicationContext, val rnViewModel: RNViewModel):
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MappyBridge"
    }
    @ReactMethod
    fun loadMaps(resort: ReadableMap, successCallback: Callback, failureCallback: Callback) {
        reactContext.applicationContext?.let { context ->
            rnViewModel.loadMaps(
                context, resort, { message ->
                    successCallback.invoke(message)
                }, { errorMessage ->
                    failureCallback.invoke(errorMessage)
                })
        }
    }

    @ReactMethod
    fun loadVenues(successCallback: Callback, failureCallback: Callback) {
        reactContext.applicationContext?.let { context ->
            rnViewModel.loadVenues(context,{ venueArray ->
                successCallback.invoke(venueArray)
            }, { errorMessage ->
                failureCallback.invoke(errorMessage)
            })
        }
    }

    @ReactMethod
    fun changeView() {
        rnViewModel.changeView()
    }

    @ReactMethod
    fun rotateToNorth() {
        rnViewModel.rotateToNorth()
    }

    @ReactMethod
    fun zoom() {
        rnViewModel.zoom()
    }
}