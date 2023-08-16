import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VenueList from './app/VenueList';
import MappyModule from './modules/MappyModule'; // Import the MappyModule
import MapScreen from './app/MapScreen'; // Import the MapScreen component
import VenuesService from './app/bridge/VenuesService';
import MappyCore from './app/bridge/MappyCore';

const Stack = createStackNavigator();

// Home screen component
const HomeScreen = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
    loadVenues();
  }, []);

  // Request location permission
  const requestLocationPermission = async () => {
    const granted = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS
      }),
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
      },
    );

    if (granted === RESULTS.GRANTED) {
      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  };
  
  // Load venues from MappyModule
  const loadVenues = () => {
    if (Platform.OS === 'android') {
      // Call the native api using the bridge
      MappyModule.loadVenues(
        (venueArray: any) => {
          console.log('Received venues:', venueArray);
          setVenues(venueArray);
          setIsLoading(false); // Finished loading, hide the indicator
        },
        (failure: any) => {
          console.log('Failed:', failure);
          setIsLoading(false); // Failed to load, hide the indicator
        }
      );
    } else {
      MappyCore.initialize()
      .then(res => {
        console.log(res);
        // NativeModules.MappyVenuesService.getVenues()
        VenuesService.getVenues()
        .then(venueArray => {
          console.log('Received venues:', venueArray);
          setVenues(venueArray);
          setIsLoading(false); // Finished loading, hide the indicator
        })
        .catch(e => console.log(e.message));
      })
      .catch(e => console.log(e.message));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading venues</Text>
        </View>
      ) : (
        <ScrollView>
          <VenueList venues={venues} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'SnowMappy', // Set the title for the header
            headerStyle: {
              backgroundColor: 'gray', // Set the desired header color
            },
            headerTintColor: 'white', // Set the color of the header text/icons
          }}
        />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
