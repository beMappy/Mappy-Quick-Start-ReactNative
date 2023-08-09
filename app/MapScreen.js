import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from './bridge/MapView';
import SceneView from './bridge/SceneView';
import Map from './bridge/Map';
import Scene from './bridge/Scene';
import MappyModule from '../modules/MappyModule';
import ComposeView from '../modules/ComposableViewModule';

const MapScreen = ({ route }) => {
  
  const { venue } = route.params;
  const [loading, setLoading] = useState(true);
  const [is3D, setIs3D] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Set the screen title when the map screen start
    navigation.setOptions({ title: venue.data.name });
    loadMap();
  }, []);

  const loadMap = () => {
    console.log('Map download started');
    if (Platform.OS === 'android') {
      // Call the native api using the bridge
      MappyModule.loadMaps(venue, androidSuccessCallback, androidFailureCallback);
    } else {
      Map.load(venue)
      .then(_ => {
        Scene.load(venue)
        .then(res => {
          setLoading(false);
          console.log("Map and Scene Load Completion");
          
          this.sceneViewRef.setScene(res)
          this.mapViewRef.setMap(res);
        })
        .catch(e => { 
          console.log('Scene Load Failed:', e.message);
          setLoading(false);
        });
      })
      .catch(e => { 
        console.log('Map Load Failed:', e.message);
        setLoading(false);
      });
    }
  };

  const androidSuccessCallback = (map, scene) => {
    console.log('Map downloaded');
    setLoading(false);
    // Handle success
  };

  const androidFailureCallback = (error) => {
    console.log('Failed:', error);
    setLoading(false);
    // Handle failure
  };

  const handleButton1Click = () => {
    if (Platform.OS === 'android') {
      MappyModule.changeView();
    } else {
      setIs3D(!is3D);
    }
  };

  const handleButton2Click = () => {
    if (Platform.OS === 'android') {
      MappyModule.rotateToNorth();
    } else {
      is3D 
      ? this.sceneViewRef.rotateToNorth()
      : this.mapViewRef.rotateToNorth();
    }
  };

  const handleButton3Click = () => {

    if (Platform.OS === 'android') {
      MappyModule.zoom();
    } else {
      is3D 
      ? this.sceneViewRef.setInitialViewpoint()
      : this.mapViewRef.setInitialViewpoint();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Downloading map</Text>
        </View>
      ) : (
        <View 
          style={{ flex: 1, width: '100%', backgroundColor: 'white', paddingHorizontal: 0 }}>
          {
            Platform.OS === 'android'
            ? <ComposeView style={{ flex: 1, marginTop: 0 }} />
            : 
              <View
                style={{ flex: 1, width: '100%', backgroundColor: 'white', paddingHorizontal: 0 }}>
                <View
                  pointerEvents = {is3D ? 'auto' : 'none'}
                  style={{flex: 1, marginTop: 0, opacity: is3D ? 1 : 0}}>
                  <SceneView
                      ref={e => this.sceneViewRef = e}/>
                </View> 

              <View 
                pointerEvents = {is3D ? 'none' : 'auto'}
                style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: is3D ? 0 : 1}}>
                <MapView 
                  ref={e => this.mapViewRef = e}
                />
              </View>
            </View>
          }

          <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'column' }}>
            <TouchableOpacity style={{ marginBottom: 10 }} onPress={handleButton1Click}>
              <View style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>V</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginBottom: 10 }} onPress={handleButton2Click}>
              <View style={{ width: 50, height: 50, backgroundColor: 'blue', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>N</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleButton3Click}>
              <View style={{ width: 50, height: 50, backgroundColor: 'green', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>Z</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
