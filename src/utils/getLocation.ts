import Geocoder from 'react-native-geocoding';
import GeoLocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';

Geocoder.init('AIzaSyDyjYp_qs8uD7vgge8xje25WBZLzIr73Rk', {language: 'ru'});
export async function requestPermissions() {
  if (Platform.OS === 'ios') {
    const auth = await GeoLocation.requestAuthorization('whenInUse');
    if (auth === 'granted') {
      // do something if granted...
    }
  }

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
      // do something if granted...
    }
  }
}

export const getLocation = () => {
  return new Promise((resolve, reject) =>
    GeoLocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true, // Whether to use high accuracy mode or not
        timeout: 15000, // Request timeout
        maximumAge: 10000, // How long previous location will be cached
      },
    ),
  );
};

export const geocodeLocationByName = (locationName: string) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(locationName)
      .then(json => {
        resolve(json.results[0].geometry.location);
      })
      .catch((error: object) => reject(error));
  });
};

export const geocodeLocationByCoords = (lat: number, long: number) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(lat, long)
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
  });
};
