import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MappyModule from '../modules/MappyModule';
import ComposeView from '../modules/ComposableViewModule';

const MapScreen = ({ route }) => {
  const { venue } = route.params;
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    // Set the screen title when the map screen start
    navigation.setOptions({ title: venue.data.name });
    loadMap();
  }, []);

  const loadMap = () => {
    console.log('Map download started');
    // Call the native api using the bridge
    MappyModule.loadMaps(venue, successCallback, failureCallback);
  };

  const successCallback = (map, scene) => {
    console.log('Map downloaded');
    setLoading(false);
    // Handle success
  };

  const failureCallback = (error) => {
    console.log('Failed:', error);
    setLoading(false);
    // Handle failure
  };

  const handleButton1Click = () => {
    MappyModule.changeView();
  };

  const handleButton2Click = () => {
    MappyModule.rotateToNorth();
  };

  const handleButton3Click = () => {
    MappyModule.zoom();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Downloading map</Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: '100%', backgroundColor: 'white', paddingHorizontal: 0 }}>
          <ComposeView style={{ flex: 1, marginTop: 0 }} />

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
