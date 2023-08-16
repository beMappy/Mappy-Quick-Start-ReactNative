import { Component } from "react";
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle
} from "react-native";

const COMPONENT_NAME = "MappyMapView";
const RNMapView = requireNativeComponent(COMPONENT_NAME);
export default class MapView extends Component {
  
    render() {
        return (
            <RNMapView 
                style={{width: '100%', height: '100%'}}
                ref={ref => this.mapRef = ref}
            />
        );
    }

    setMap = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.mapRef),
            UIManager[COMPONENT_NAME].Commands.setMap,
            [...args]
        );
    };

    rotateToNorth = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.mapRef),
            UIManager[COMPONENT_NAME].Commands.rotateToNorth,
            [...args]
        );
    };

    setInitialViewpoint = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.mapRef),
            UIManager[COMPONENT_NAME].Commands.setInitialViewpoint,
            [...args]
        );
    };
}
