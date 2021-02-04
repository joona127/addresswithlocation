import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';

export default function App() {

  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  };
  
  const [region, setRegion] = useState(initial);
  const [address, setAddress] = useState('');

  useEffect(() => {
  const fetchLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');

    } else {
      try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      console.log(location);
      setRegion({... region, latitude: location.coords.latitude, longitude: location.coords.longitude});
      } catch (error) {
       console.log(error.message);
      }
    }
  
  }
fetchLocation();
}, []);

   const fetchData = async (address) => {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=WwGFrdNRZArJkEPUKS6jTezQcrq8KnlK&inFormat=kvp&outFormat=json&location=${address}&thumbMaps=false`;
    const response = await fetch(url);
    const responseData = await response.json();
    if (response.ok) {
      const { lat, lng } = responseData.results[0].locations[0].latLng;
     setRegion({...region, latitude: lat, longitude: lng})
    } else {
      console.error('Failed to fetch');
    }
     
  }

  return (
    <View style= {{ flex: 1}}>
    <MapView
    style={{ flex: 1}}
    region={region} 
    >
    <Marker
    coordinate={region} />
      </MapView> 
      <TextInput
      style={styles.input}
      placeholder={'Address'}
      value= { address }
      onChangeText={text => setAddress(text)}
      />
      <View style={styles.button}>
      <Button title="Show" onPress={() => fetchData(address)} />
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
