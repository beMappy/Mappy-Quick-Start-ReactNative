package com.snowmappyrn

import io.bemappy.sdk.loadables.Map
import io.bemappy.sdk.loadables.Scene

sealed class MapState {
    object Error: MapState()
    class Loading(val progress: Int = 0): MapState()
    class Loaded(val map: Map, val scene: Scene): MapState()
}