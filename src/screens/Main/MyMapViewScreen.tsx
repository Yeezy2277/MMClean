import React, {useEffect, useRef, useState} from 'react';
import MapView from 'react-native-maps';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Text,
} from 'react-native';
import Marker from '../../components/Svg/marker.svg';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Preloader from '../../components/Preloader';
import MyButton from '../../components/MyButton';
import Close from '../../components/Svg/Close.svg';
import {Colors} from '../../constants/Colors';
import Location from '../../components/Svg/Loc.svg';
import {
  geocodeLocationByCoords,
  geocodeLocationByName,
} from '../../utils/getLocation';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MyMapView = ({navigation, route}) => {
  const [region, setRegion] = useState({});
  const [location, setLocation] = useState({});
  const [camera, setCamera] = useState({});
  const [text, setText] = useState();
  const [heightValue, setHeightValue] = useState(0.6);

  useEffect(() => {
    getInitialState();
  }, []);

  useEffect(() => {
    myRef.current?.setAddressText(text);
  }, [text]);

  useEffect(() => {
    (async () => {
      const cam = await mapRef.current?.getCamera();
      setCamera(cam);
    })();
  }, [region]);

  const myRef = useRef();
  const mapRef = useRef();

  const getInitialState = () => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setHeightValue(0.1);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setHeightValue(0.6);
    });

    setRegion(route.params.region);
    setLocation(route.params.initialRegion);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  };

  const getCoordsFromName = loc => {
    geocodeLocationByName(loc).then(async r => {
      setRegion({
        latitude: r.lat,
        longitude: r.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      });
      mapRef.current?.animateToRegion({
        latitude: r.lat,
        longitude: r.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      });
    });
  };

  const getNameFromCoords = reg => {
    geocodeLocationByCoords(reg.latitude, reg.longitude).then(r => {
      setText(r.results[0].formatted_address);
    });
  };
  return region.latitude ? (
    <View style={{flex: 2, zIndex: 0}}>
      {region.latitude ? (
        <View style={[{height: height * heightValue, width}]}>
          <View
            style={{
              zIndex: 3,
              position: 'absolute',
              width: 28,
              height: 37,
              marginTop: -37,
              marginLeft: -11,
              left: '50%',
              top: (height * heightValue) / 2,
            }}>
            <Marker />
          </View>
          <MapView
            ref={mapRef}
            style={{flex: 1, zIndex: 1}}
            onPress={Keyboard.dismiss}
            onRegionChangeComplete={reg => {
              getNameFromCoords(reg);
              setRegion(reg);
            }}
            onPanDrag={Keyboard.dismiss}
            initialRegion={region}
          />
        </View>
      ) : null}
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingVertical: width * 0.05,
            paddingHorizontal: width * 0.06,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 20}}>Укажите адрес</Text>
            <TouchableOpacity
              onPress={() => {
                mapRef.current.animateToRegion(location);
                getNameFromCoords(location);
              }}>
              <Location />
            </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
            ref={myRef}
            placeholder="Поиск нужного места"
            minLength={2} // minimum length of text to search
            returnKeyType={'search'} // Can be left out for default return key listViewDisplayed={false}    // true/false/undefined
            onPress={data => {
              // 'details' is provided when fetchDetails = true
              getCoordsFromName(data.description);
            }}
            styles={{
              textInput: styles.input,
              textInputContainer: {
                borderBottomWidth: 1,
                paddingBottom: 8,
                borderColor: '#A0A3BD',
                alignItems: 'center',
                justifyContent: 'center',
              },
              container: {
                justifyContent: heightValue === 0.1 ? 'flex-start' : 'center',
                alignItems: 'center',
              },
            }}
            renderRightButton={() => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => myRef.current?.setAddressText('')}>
                <Close />
              </TouchableOpacity>
            )}
            textInputProps={{
              clearButtonMode: 'never',
            }}
            query={{
              key: 'AIzaSyDyjYp_qs8uD7vgge8xje25WBZLzIr73Rk',
              language: 'ru',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={300}
          />
          {heightValue === 0.6 ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <MyButton
                width={width * 0.9}
                title={'Выбрать'}
                onPress={async () => {
                  navigation.goBack();
                  await route.params.updateAddress(
                    myRef.current?.getAddressText(),
                    region,
                    camera,
                  );
                }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  ) : (
    <Preloader />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    color: Colors.violet,
    paddingHorizontal: 0,
    paddingRight: width * 0.05,
    fontWeight: '500',
    fontSize: 15,
  },
  button: {
    paddingBottom: 8,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: 'gray',
  },
});

export default MyMapView;
