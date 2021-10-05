import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaViewComponent,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = 'b75752ec3b47dc5e67e3c96fb922a65b';
export default function App() {
  const [city, setCity] = useState('loading');
  const [days, setDays] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setErrorMsg('permission denied');
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    const json = await response.json();
    console.log(json);
    setDays(json.list);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}> {city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.weather}
      >
        {/* <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.desc}>looks good</Text>
        </View> */}

        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          days.map((x, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>
                {' '}
                {parseFloat(x.main.temp).toFixed(1)}
              </Text>
              <Text style={styles.desc}> {x.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
  },
  day: {
    flex: 1,
    width: SCREEN_WIDTH,
    // alignItems: 'center',
    marginLeft: 5,
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 50,
    fontWeight: '500',
  },
  weather: {
    // flex: 3,
  },
  temp: {
    fontSize: 80,
  },
  desc: {
    fontSize: 20,
    // marginTop: 50,
  },
});
