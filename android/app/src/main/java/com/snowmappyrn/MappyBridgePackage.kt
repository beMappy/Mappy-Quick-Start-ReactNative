package com.snowmappyrn

import MappyBridge
import android.app.Application
import androidx.lifecycle.ViewModelProvider
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext

class MappyBridgePackage(private val application: Application) : ReactPackage {
    private lateinit var myViewModel: RNViewModel // Declare a lateinit variable for your view model

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()
        modules.add(MappyBridge(reactContext, getMyViewModel()))
        return modules
    }

    override fun createViewManagers(context: ReactApplicationContext) = listOf(
        ComposeViewManager(getMyViewModel())
    )

    // Create a method to instantiate your view model
    private fun getMyViewModel(): RNViewModel {
        if (!::myViewModel.isInitialized) {
            myViewModel = ViewModelProvider.AndroidViewModelFactory(application)
                .create(RNViewModel::class.java)
        }
        return myViewModel
    }
}