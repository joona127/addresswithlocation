import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';

export default function App() {

  const [location, setLocation] = React.useState('');
  const [targetLatitude, setTargetLatitude] = React.useState(60.200692);
  const [targetLongitude, setTargetLongitude] = React.useState(24.934302);
  const [data, setData] = React.useState([]);

  const fetchData = useCallback(async () => {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=WwGFrdNRZArJkEPUKS6jTezQcrq8KnlK&inFormat=kvp&outFormat=json&location=${location}&thumbMaps=false`;
    const response = await fetch(url);
    const responseData = await response.json();
    if (response.ok) {
     setData(responseData.results[0].locations[0])
    } else {
      console.error('Failed to fetch');
    }
     
  })

  const onRegionChange = () => {
    return {
      region: {
        latitude: targetLatitude,
        longitude: targetLongitude,
      },
    };
  }

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');

    } else {
      let location = await Location.getCurrentPositionAsync({});
    }
  };

  useEffect (() => {
    fetchData();
    getLocation();
  }, [location]);

  const findLocation = () => {
   setTargetLatitude(data.latLng.lat);
    setTargetLongitude(data.latLng.lng);
    onRegionChange();
  }


  return (
    <View style= {{ flex: 1}}>
    <MapView
    style={{ flex: 1}}
    initialRegion={{
      latitude: getLocation(),
      longitude: getLocation(),
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221,
    }} 
    region={{
      latitude: targetLatitude,
      longitude: targetLongitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.2,
    }}>
    <Marker
    coordinate={{
      latitude: targetLatitude,
      longitude: targetLongitude,}}
      title={location} />
      </MapView> 
      <TextInput
      style={styles.input}
      value= { location }
      onChangeText={(location) => setLocation(location)}
      />
      <View style={styles.button}>
      <Button title="Show" onPress={() => findLocation()} />
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    alignSelf: 'stretch',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    // marginTop: 25
  },
  button: {
    marginBottom: 30
  }
});
