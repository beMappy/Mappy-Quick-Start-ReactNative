package com.snowmappyrn

import android.util.Log
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material.Text
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import io.bemappy.sdk.ui.compose.ComposableMapView.MapView
import io.bemappy.sdk.ui.compose.ComposableSceneView.SceneView
import io.bemappy.sdk.ui.listeners.LocationDisplayErrorListener
import io.bemappy.sdk.utils.MappyLocationDataSource


class ComposeViewManager(val viewModel: RNViewModel) : SimpleViewManager<ComposeView>() {

    override fun getName() = "ComposeView"

    override fun createViewInstance(context: ThemedReactContext): ComposeView {
        return ComposeView(context).apply {
            setContent {
                if (viewModel.isMapLoaded.value) {
                    val locationDataSource = remember { MappyLocationDataSource(context) }

                    Box(modifier = Modifier.fillMaxSize()) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize(if (viewModel.is3D.value.not()) 1f else 0f)
                        ) {
                            MapView(
                                map = viewModel.map,
                                modifier = Modifier.fillMaxSize(),
                                mapController = viewModel.mapController,
                                onTap = { feature ->
                                    feature?.let { viewModel.mapController.selectFeature(it) }
                                },
                                onAvatarTap = { userId ->

                                },
                                onViewPointChanged = {
                                    viewModel.is2dFacingNorth.value =
                                        viewModel.mapController.isDefaultRotation
                                },
                                onFinishLoading = {
                                    viewModel.mapController.startLocationDisplay(
                                        customLocationDataSource = locationDataSource,
                                        listener = object : LocationDisplayErrorListener {
                                            override fun onError(throwable: Throwable) {
                                                throwable.printStackTrace()
                                                Log.e("MapDownload", "2D location Failed")
                                            }
                                        }
                                    )
                                }
                            )
                        }
                        Box(
                            modifier = Modifier
                                .fillMaxSize(if (viewModel.is3D.value) 1f else 0f)
                        ) {
                            SceneView(
                                scene = viewModel.scene,
                                modifier = Modifier.fillMaxSize(),
                                sceneController = viewModel.sceneController,
                                onTap = { feature ->
                                    feature?.let { viewModel.sceneController.selectFeature(it) }
                                },
                                onAvatarTap = { userId ->

                                },
                                onViewPointChanged = {
                                    viewModel.is3dFacingNorth.value =
                                        viewModel.sceneController.isDefaultRotation
                                },
                                onFinishLoading = {
                                    viewModel.sceneController.startLocationDisplay(
                                        customLocationDataSource = locationDataSource,
                                        listener = object : LocationDisplayErrorListener {
                                            override fun onError(throwable: Throwable) {
                                                throwable.printStackTrace()
                                                Log.e("MapDownload", "3D location Failed")
                                            }
                                        }
                                    )
                                }
                            )
                        }
                    }
                } else {
                    Text(
                        text = "Map downloading",
                        modifier = Modifier
                            .wrapContentSize(align = Alignment.Center)
                    )
                }
            }
        }
    }
}