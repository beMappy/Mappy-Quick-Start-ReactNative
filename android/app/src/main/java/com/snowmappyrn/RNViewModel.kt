package com.snowmappyrn

import android.content.Context
import android.util.Log
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import io.bemappy.sdk.loadables.Map
import io.bemappy.sdk.loadables.Scene
import io.bemappy.sdk.models.BreadcrumbPayload
import io.bemappy.sdk.models.Data
import io.bemappy.sdk.models.GeoReference
import io.bemappy.sdk.models.TerrainPercentage
import io.bemappy.sdk.models.Venue
import io.bemappy.sdk.models.callbacks.CompletionCallback
import io.bemappy.sdk.services.auth.Mappy
import io.bemappy.sdk.services.tracking.TrackingService
import io.bemappy.sdk.services.venue.VenueService
import io.bemappy.sdk.ui.compose.controllers.MapController
import io.bemappy.sdk.ui.compose.controllers.SceneController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RNViewModel : ViewModel() {

    val isMapLoaded: MutableState<Boolean> = mutableStateOf(false)
    val is3D: MutableState<Boolean> = mutableStateOf(false)
    val is2dFacingNorth: MutableState<Boolean> = mutableStateOf(false)
    val is3dFacingNorth: MutableState<Boolean> = mutableStateOf(false)

    lateinit var map: Map
    lateinit var scene: Scene
    val mapController = MapController()
    val sceneController = SceneController()

    fun loadVenues(
        context: Context,
        success: (WritableArray) -> Unit,
        failure: (String) -> Unit,
    ) {
        val mappy = Mappy.createInstance(context)
        val venueService = VenueService.createInstance(context)

        CoroutineScope(Dispatchers.IO).launch {
            runCatching {
                val cachedUserId = getId(context)

                val id = context.getString(R.string.prod_id)
                val secret = context.getString(R.string.prod_secret)

                if (cachedUserId.isNotEmpty()) {
                    mappy.initialize(id, secret, cachedUserId)
                } else {
                    val newId = mappy.initialize(id, secret)
                    saveId(context, newId)
                }

                venueService.getVenues()
            }.onSuccess { venues ->
                val venueArray = convertToWritableArray(venues)
                success.invoke(venueArray)
            }.onFailure { throwable ->
                throwable.printStackTrace()
                failure.invoke(throwable.message ?: "Unknown error occurred.")
            }
        }
    }

    fun loadMaps(
        context: Context,
        resort: ReadableMap,
        success: (String) -> Unit,
        failure: (String) -> Unit,
    ) {
        isMapLoaded.value = false

        val venue = convertReadableMapToVenue(resort)
        Log.e("MapDownload", "Venue: " + venue.data.name)

        TrackingService.createInstance(context).changeTrackingPayload(
            BreadcrumbPayload(
                selectedResort = venue.data.name
            )
        )

        map = Map(venue)
        scene = Scene(venue)
        Log.e("MapDownload", "Started")
        map.load(context = context, completionCallback = object : CompletionCallback<Map> {
            override fun onError(throwable: Throwable) {
                Log.e("MapDownload", "2D Map Failed")
                failure.invoke(throwable.message ?: "2D Map download failed.")
            }

            override fun onSuccess(result: Map) {
                Log.e("MapDownload", "2D Map Downloaded")
                loadScene(context, success, failure)
            }
        })
    }

    private fun loadScene(
        context: Context,
        success: (String) -> Unit,
        failure: (String) -> Unit,
    ) {
        scene.load(context = context, loadingListener = object : CompletionCallback<Scene> {
            override fun onError(throwable: Throwable) {
                Log.e("MapDownload", "3D Map Failed")
                failure.invoke(throwable.message ?: "3D Map download failed.")
            }

            override fun onSuccess(result: Scene) {
                Log.e("MapDownload", "3D Map Downloaded")
                isMapLoaded.value = true
                success.invoke("success")
            }
        })
    }

    fun changeView() {
        is3D.value = is3D.value.not()
    }

    fun rotateToNorth() {
        if (is3D.value) {
            sceneController.rotateToNorth()
        } else {
            mapController.rotateToNorth()
        }
    }

    fun zoom() {
        if (is3D.value) {
            sceneController.setInitialViewpoint()
        } else {
            mapController.setInitialViewpoint()
        }
    }

    private fun saveId(context: Context, id: String) {
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE).edit().apply {
            putString(ID, id)
            apply()
        }
    }

    private fun getId(context: Context): String {
        return context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .getString(ID, "") ?: ""
    }

    private fun convertToWritableArray(venues: List<Venue>): WritableArray {
        val venueArray = Arguments.createArray()
        for (venue in venues) {
            val venueMap = convertVenueToWritableMap(venue)
            venueArray.pushMap(venueMap)
        }
        return venueArray
    }

    private fun convertVenueToWritableMap(venue: Venue): WritableMap {
        val venueMap = Arguments.createMap()
        val dataMap = Arguments.createMap()
        val geoReferenceMap = Arguments.createMap()
        val terrainPercentageMap = Arguments.createMap()

        with(venue.data) {
            dataMap.putInt("baseElevation", baseElevation)
            dataMap.putString("description", description)
            dataMap.putInt("gondolaCount", gondolaCount)
            dataMap.putInt("liftCount", liftCount)
            dataMap.putInt("medianElevation", medianElevation)
            dataMap.putString("name", name)
            dataMap.putString("skiPatrolEmergencyNumber", skiPatrolEmergencyNumber)
            dataMap.putInt("skiableArea", skiableArea)
            dataMap.putString("terrainParkCount", terrainParkCount)
            dataMap.putInt("verticalElevation", verticalElevation)
            dataMap.putInt("ziplineCount", ziplineCount)
            dataMap.putInt("maxScale", maxScale)
            dataMap.putInt("minScale", minScale)

            with(geoReference) {
                geoReferenceMap.putDouble("maxX", maxX)
                geoReferenceMap.putDouble("maxY", maxY)
                geoReferenceMap.putDouble("minX", minX)
                geoReferenceMap.putDouble("minY", minY)
            }

            with(terrainPercentage) {
                terrainPercentageMap.putDouble("advanced", advanced)
                terrainPercentageMap.putDouble("beginner", beginner)
                terrainPercentageMap.putDouble("intermediate", intermediate)
            }
        }

        dataMap.putMap("geoReference", geoReferenceMap)
        dataMap.putMap("terrainPercentage", terrainPercentageMap)

        venueMap.putMap("data", dataMap)
        venueMap.putString("venueId", venue.venueId)

        return venueMap
    }

    private fun convertReadableMapToVenue(venueMap: ReadableMap): Venue {
        val dataMap = venueMap.getMap("data")
        val geoReferenceMap = dataMap?.getMap("geoReference")
        val terrainPercentageMap = dataMap?.getMap("terrainPercentage")

        val data = Data(
            baseElevation = dataMap?.getInt("baseElevation") ?: 0,
            description = dataMap?.getString("description") ?: "",
            geoReference = convertReadableMapToGeoReference(geoReferenceMap),
            gondolaCount = dataMap?.getInt("gondolaCount") ?: 0,
            liftCount = dataMap?.getInt("liftCount") ?: 0,
            medianElevation = dataMap?.getInt("medianElevation") ?: 0,
            name = dataMap?.getString("name") ?: "",
            skiPatrolEmergencyNumber = dataMap?.getString("skiPatrolEmergencyNumber") ?: "",
            skiableArea = dataMap?.getInt("skiableArea") ?: 0,
            terrainParkCount = dataMap?.getString("terrainParkCount") ?: "",
            terrainPercentage = convertReadableMapToTerrainPercentage(terrainPercentageMap),
            verticalElevation = dataMap?.getInt("verticalElevation") ?: 0,
            ziplineCount = dataMap?.getInt("ziplineCount") ?: 0,
            maxScale = dataMap?.getInt("maxScale") ?: 0,
            minScale = dataMap?.getInt("minScale") ?: 0,
        )

        return Venue(
            data = data,
            venueId = venueMap.getString("venueId") ?: ""
        )
    }

    private fun convertReadableMapToGeoReference(geoReferenceMap: ReadableMap?): GeoReference {
        val maxX = geoReferenceMap?.getDouble("maxX") ?: 0.0
        val maxY = geoReferenceMap?.getDouble("maxY") ?: 0.0
        val minX = geoReferenceMap?.getDouble("minX") ?: 0.0
        val minY = geoReferenceMap?.getDouble("minY") ?: 0.0

        return GeoReference(maxX, maxY, minX, minY)
    }

    private fun convertReadableMapToTerrainPercentage(terrainPercentageMap: ReadableMap?): TerrainPercentage {
        val advanced = terrainPercentageMap?.getDouble("advanced") ?: 0.0
        val beginner = terrainPercentageMap?.getDouble("beginner") ?: 0.0
        val intermediate = terrainPercentageMap?.getDouble("intermediate") ?: 0.0

        return TerrainPercentage(advanced, beginner, intermediate)
    }

    companion object {
        private const val ID = "id"
        private const val PREFERENCES = "preferences"
    }
}