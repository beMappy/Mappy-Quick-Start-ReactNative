import { Component } from "react";
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle
} from "react-native";

const COMPONENT_NAME = "MappySceneView";
const RNSceneView = requireNativeComponent(COMPONENT_NAME);
export default class SceneView extends Component {
  
    render() {
        return (
            <RNSceneView 
                style={{width: '100%', height: '100%'}}
                ref={ref => this.sceneRef = ref}
            />
        );
    }

    setScene = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.sceneRef),
            UIManager[COMPONENT_NAME].Commands.setScene,
            [...args]
        );
    };

    rotateToNorth = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.sceneRef),
            UIManager[COMPONENT_NAME].Commands.rotateToNorth,
            [...args]
        );
    };

    setInitialViewpoint = (...args) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.sceneRef),
            UIManager[COMPONENT_NAME].Commands.setInitialViewpoint,
            [...args]
        );
    };
}
