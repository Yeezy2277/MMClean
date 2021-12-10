import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Appearance,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import MyInput from '../../components/MyInput';
import MapView, {Marker} from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  geocodeLocationByCoords,
  geocodeLocationByName,
  getLocation,
} from '../../utils/getLocation';
import Preloader from '../../components/Preloader';
import MyButton from '../../components/MyButton';
import {
  calculateLocationError,
  commonError,
  errorChooseDateOrTime,
  errorFetchCalculator,
} from '../../constants/alerts';
import {Host, Portal} from 'react-native-portalize';
import regular from '../../components/Svg/regular.svg';
import general from '../../components/Svg/general.svg';
import afterBuild from '../../components/Svg/afterBuild.svg';

import hotelBackground from '../../components/Svg/hotelBackground.svg';
import officeBackground from '../../components/Svg/officeBackground.svg';
import homeBackground from '../../components/Svg/homeBackground.svg';
import cafeBackground from '../../components/Svg/cafeBackground.svg';

import Radio from '../../components/Svg/radio.svg';
import Plus from '../../components/Svg/plus.svg';
import Clock from '../../components/Svg/clock.svg';
import Star from '../../components/Svg/star.svg';
import StackSvg from '../../components/Svg/stack.svg';
import Hotel from '../../components/Svg/hotel.svg';
import Office from '../../components/Svg/office.svg';
import Home from '../../components/Svg/home.svg';
import Coffee from '../../components/Svg/coffee.svg';
import Calendar from '../../components/Svg/calendar.svg';
import Time from '../../components/Svg/time.svg';
import PaymentModal from '../../modals/PaymentModal';
import {Colors} from '../../constants/Colors';
import MarkerCustom from '../../components/Svg/marker.svg';
import {accountAPI, calculateAPI} from '../../constants/api';
import MyMapView from './MyMapViewScreen';
import {setTokenRequest} from '../../utils/commonFunctions';
import PaymentScreen from './PaymentScreen';
import Close from '../../components/Svg/CloseBig.svg';
import AdditionalPrices from './AdditionalPricesScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Props} from '../../constants/types';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../store/store';

const width = Dimensions.get('screen').width;

const Stack = createStackNavigator();

const CalculateRoot: ({navigation}: Props) => JSX.Element = ({
  navigation,
}: Props) => {
  return (
    <Host>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            height: 105,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '500',
            justifyContent: 'center',
            alignSelf: 'center',
            color: 'white',
            fontSize: 24,
          },
          headerBackground: () => (
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={['#3ad666', '#2eade8']}
              style={[StyleSheet.absoluteFill]}
            />
          ),
        }}>
        <Stack.Screen name="Калькулятор" component={CalculateScreen} />
        <Stack.Screen
          name="Платеж"
          options={{
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <View style={{marginLeft: 15}}>
                <Close />
              </View>
            ),
          }}
          component={PaymentScreen}
        />
        <Stack.Screen
          name="Карта"
          options={{
            headerShown: false,
            headerStyle: {
              height: 105,
            },
            headerTitleAlign: 'center',
            headerLeft: () => null,
            headerTitleStyle: {
              fontWeight: '500',
              justifyContent: 'center',
              alignSelf: 'center',
              color: 'white',
              fontSize: 24,
            },
            headerBackground: () => (
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#3ad666', '#2eade8']}
                style={[StyleSheet.absoluteFill]}
              />
            ),
          }}
          component={MyMapView}
        />
        <Stack.Screen
          name="Дополнительные услуги"
          options={{
            headerShown: true,
            headerStyle: {
              height: 105,
            },
            headerTitleAlign: 'center',
            headerLeft: () => null,
            headerTitleStyle: {
              fontWeight: '500',
              justifyContent: 'center',
              alignSelf: 'center',
              color: 'white',
              fontSize: 24,
            },
            headerBackground: () => (
              <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                colors={['#3ad666', '#2eade8']}
                style={[StyleSheet.absoluteFill]}
              />
            ),
          }}
          component={AdditionalPrices}
        />
      </Stack.Navigator>
    </Host>
  );
};

const CalculateScreen: ({navigation}: Props) => JSX.Element = ({
  navigation,
}: Props) => {
  const dispatch = useDispatch();
  const commonState = useSelector((state: rootState) => state.list);
  let modal = useRef(null).current;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [type, setType] = useState('');
  const [prices, setPrices] = useState({
    regular: 0,
    general: 0,
    afterBuild: 0,
    flat: 0,
    office: 0,
    home: 0,
    cafe: 0,
    square: 0,
    door: 0,
    window: 0,
    toilet: 0,
    mkad: 0,
  });

  const [isErrorField, setErrorField] = useState(false);
  const [info, setInfo] = useState({});
  const [square, setSquare] = useState('');
  const [squareMeter, setSquareMeter] = useState('');
  const [doorCount, setDoorCount] = useState('');
  const [windowCount, setWindowCount] = useState('');
  const [toiletCount, setToiletCount] = useState('');
  const [mileageMkad, setMileageMkad] = useState('');
  const [flat, setFlat] = useState('');
  const [comment, setComment] = useState('');
  const [bonusKoef, setBonusKoef] = useState(0.05);
  const [colorPicker, setColorPicker] = useState('');

  const [regularState, setRegularState] = useState(true);
  const [generalState, setGeneralState] = useState(false);
  const [afterBuildState, setAfterBuildState] = useState(false);

  const [hotelState, setHotelState] = useState(true);
  const [officeState, setOfficeState] = useState(false);
  const [homeState, setHomeState] = useState(false);
  const [cafeState, setCafeState] = useState(false);

  const [bonusSize, setBonusSize] = useState(0);

  const [allSum, setAllSum] = useState(0);
  const [cleanSum, setCleanSum] = useState(0);
  const [roadSum, setRoadSum] = useState(0);
  const [bonusSum, setBonusSum] = useState(0);
  const [additions, setAdditions] = useState([]);

  const [dateValue, setDateValue] = useState('Дата');
  const [dateString, setDateString] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState('Время');

  const mapRef = useRef();
  const mainFlatList = useRef(null);
  const cleanFlatList = useRef(null);
  const buildFlatList = useRef(null);

  const [isPending, setIsPending] = useState<boolean>(true);
  const [region, setRegion] = useState({});
  const [initialRegion, setInitialRegion] = useState({});

  const [address, setAddress] = useState('');
  const updateAddress = async (string, reg, camera) => {
    setAddress(string);
    setRegion(reg);
    camera.zoom = 12;
    mapRef.current?.animateCamera(camera);
  };
  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    Keyboard.dismiss();
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmDate = date => {
    setDateString(
      `${date.getDate() < 10 ? '0' : ''}${date.getDate()}.${
        date.getMonth() + 1 < 10 ? '0' : ''
      }${date.getMonth() + 1}.${date.getFullYear()}`,
    );
    setDateValue(
      `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${
        date.getMonth() + 1
      }-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`,
    );
    hideDatePicker();
  };
  const handleConfirmTime = time => {
    setTimeValue(
      `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${
        time.getMinutes() < 10 ? '0' : ''
      }${time.getMinutes()}`,
    );
    hideTimePicker();
  };
  const [isScroll, setScroll] = useState(true);
  const getInitialState = () => {
    getLocation()
      .then(data => {
        setRegion({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        });
        setInitialRegion({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        });
        geocodeLocationByCoords(data.coords.latitude, data.coords.longitude)
          .then(r => {
            setAddress(r.results[0].formatted_address);
            setTokenRequest(accountAPI.getAccount)
              .then(r => {
                if (r === undefined) {
                  console.log(r);
                } else {
                  setBonusSize(r.data.main_info.bonus_balance);
                  calculateAPI
                    .getOptions()
                    .then(r => {
                      console.warn(r.data);
                      let obj = {...prices};
                      obj.regular = r.data.options.type_regular;
                      obj.general = r.data.options.type_general;
                      obj.afterBuild = r.data.options.type_after_repair;
                      obj.flat = r.data.options.type_building_flat;
                      obj.office = r.data.options.type_building_office;
                      obj.house = r.data.options.type_building_house;
                      obj.cafe = r.data.options.type_building_cafe;
                      obj.square = r.data.options.area;
                      obj.door = r.data.options.door;
                      obj.window = r.data.options.window;
                      obj.toilet = r.data.options.bathroom;
                      obj.mkad = r.data.options.mkad;
                      setPrices(obj);
                      let colorScheme = Appearance.getColorScheme();
                      setColorPicker(colorScheme);
                      setIsPending(false);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            setAddress('Пресненская наб., 6, Москва, Россия, 123317');
            console.warn(err);
            setTokenRequest(accountAPI.getAccount)
              .then(r => {
                if (r === undefined) {
                } else {
                  setBonusSize(r.data.main_info.bonus_balance);
                  calculateAPI.getOptions().then(r => {
                    let obj = {...prices};
                    obj.regular = r.data.options.type_regular;
                    obj.general = r.data.options.type_general;
                    obj.afterBuild = r.data.options.type_after_repair;
                    obj.flat = r.data.options.type_building_flat;
                    obj.office = r.data.options.type_building_office;
                    obj.house = r.data.options.type_building_house;
                    obj.cafe = r.data.options.type_building_cafe;
                    obj.square = r.data.options.area;
                    obj.door = r.data.options.door;
                    obj.window = r.data.options.window;
                    obj.toilet = r.data.options.bathroom;
                    obj.mkad = r.data.options.mkad;
                    setPrices(obj);
                    setColorPicker(Appearance.getColorScheme());
                    setIsPending(false);
                  });
                }
              })
              .catch(err => console.log(err));
          });
      })
      .catch(err => {
        setAddress('Пресненская наб., 6, Москва, Россия, 123317');
        geocodeLocationByName(
          'Пресненская наб., 6, Москва, Россия, 123317',
        ).then(r => {
          setRegion({
            latitude: r.lat,
            longitude: r.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          });
          setInitialRegion({
            latitude: r.lat,
            longitude: r.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          });
          setTokenRequest(accountAPI.getAccount)
            .then(r => {
              if (r === undefined) {
              } else {
                setBonusSize(r.data.main_info.bonus_balance);
                calculateAPI.getOptions().then(r => {
                  console.warn(r.data.options);
                  let obj = {...prices};
                  obj.regular = r.data.options.type_regular;
                  obj.general = r.data.options.type_general;
                  obj.afterBuild = r.data.options.type_after_repair;
                  obj.flat = r.data.options.type_building_flat;
                  obj.office = r.data.options.type_building_office;
                  obj.house = r.data.options.type_building_house;
                  obj.cafe = r.data.options.type_building_cafe;
                  obj.square = r.data.options.area;
                  obj.door = r.data.options.door;
                  obj.window = r.data.options.window;
                  obj.toilet = r.data.options.bathroom;
                  obj.mkad = r.data.options.mkad;
                  setPrices(obj);
                  let colorScheme = Appearance.getColorScheme();
                  setColorPicker(colorScheme);
                  setIsPending(false);
                });
              }
            })
            .catch(() => console.log(err));
        });
      });
  };
  useEffect(() => {
    (async () => {
      getInitialState();
    })();
  }, []);
  useEffect(() => {
    if (commonState.isSetData) {
      setIsPending(true);
      setTokenRequest(calculateAPI.getAddress, {id: commonState.id})
        .then(r => {
          if (r === undefined) {
            commonError();
          } else {
            setAddress(r.data.adress);
            setSquareMeter(String(r.data.area));
            setToiletCount(String(r.data.bathroom));
            if (r.data.cleaning_type === 'Регулярная уборка') {
              setRegularState(true);
              setGeneralState(false);
              setAfterBuildState(false);
            } else if (r.data.cleaning_type === 'Генеральная уборка') {
              setRegularState(false);
              setGeneralState(true);
              setAfterBuildState(false);
            } else {
              setRegularState(false);
              setGeneralState(false);
              setAfterBuildState(true);
            }
            if (r.data.premises_type === 'Квартира') {
              setHotelState(true);
              setOfficeState(false);
              setHomeState(false);
              setCafeState(false);
            } else if (r.data.premises_type === 'Офис') {
              setHotelState(false);
              setOfficeState(true);
              setHomeState(false);
              setCafeState(false);
            } else if (r.data.premises_type === 'Загородный дом') {
              setHotelState(false);
              setOfficeState(false);
              setHomeState(true);
              setCafeState(false);
            } else {
              setHotelState(false);
              setOfficeState(false);
              setHomeState(false);
              setCafeState(true);
            }
            setComment(r.data.comment);
            setRegion(r.data.coordinates);
            setDoorCount(String(r.data.door));
            setFlat(r.data.flat_or_office == 0 ? '' : r.data.flat_or_office);
            setMileageMkad(r.data.mkad == 0 ? '' : String(r.data.mkad));
            setWindowCount(String(r.data.window));
            setDateValue('Дата');
            setTimeValue('Время');
            setIsPending(false);
          }
        })
        .catch(err => {
          console.log(err);
          commonError();
        });
    } else if (commonState.isNeedDelete) {
      getInitialState();
      setErrorField(false);
      setRegularState(true);
      setGeneralState(false);
      setAfterBuildState(false);
      setHotelState(true);
      setOfficeState(false);
      setHomeState(false);
      setCafeState(false);
      setComment('');
      setDoorCount('');
      setFlat('');
      setMileageMkad('');
      setWindowCount('');
      setSquareMeter('');
      setToiletCount('');
      setDateValue('Дата');
      setTimeValue('Время');
    }
  }, [commonState]);
  useEffect(() => {
    let object = {};
    object.typeClean = regularState
      ? prices.regular
      : generalState
      ? prices.general
      : afterBuildState
      ? prices.afterBuild
      : null;
    object.typeBuilding = hotelState
      ? prices.flat
      : officeState
      ? squareMeter === '0' || squareMeter === ''
        ? 0
        : prices.office
      : homeState
      ? squareMeter === '0' || squareMeter === ''
        ? 0
        : prices.home
      : cafeState
      ? squareMeter === '0' || squareMeter === ''
        ? 0
        : prices.cafe
      : null;
    object.priceSquare =
      object.typeClean + object.typeClean * object.typeBuilding;
    object.square =
      squareMeter !== '0' || squareMeter !== ''
        ? squareMeter * object.priceSquare
        : 0;
    object.doors = doorCount * prices.door;
    object.windows = windowCount * prices.window;
    object.toilets = toiletCount * prices.toilet;
    let addSum = 0;
    additions.map(item => {
      return item.count > 0 ? (addSum += item.count * item.price) : null;
    });
    object.additions = addSum;
    setCleanSum(
      object.typeClean * object.typeBuilding +
        object.square +
        object.doors +
        object.windows +
        object.toilets +
        object.additions,
    );
  }, [
    regularState,
    generalState,
    afterBuildState,
    hotelState,
    officeState,
    homeState,
    cafeState,
    square,
    squareMeter,
    doorCount,
    windowCount,
    toiletCount,
    additions,
  ]);
  useEffect(() => {
    setRoadSum(mileageMkad * 40);
  }, [mileageMkad]);
  useEffect(() => {
    setCleanSum(Math.round(cleanSum));
    setAllSum(Math.round(cleanSum + roadSum));
    setBonusSum(Math.round(allSum * bonusKoef));
  }, [cleanSum, roadSum, allSum, bonusKoef]);
  const type1 = [
    {
      id: 1,
      icon: Clock,
      text: 'Регулярная уборка',
      background: regular,
      borderColor: Colors.green,
      state: regularState,
      setState: setRegularState,
    },
    {
      id: 2,
      icon: Star,
      text: 'Генеральная уборка',
      background: general,
      borderColor: Colors.blue,
      state: generalState,
      setState: setGeneralState,
    },
    {
      id: 3,
      icon: StackSvg,
      text: 'После ремонта',
      background: afterBuild,
      borderColor: Colors.orange,
      state: afterBuildState,
      setState: setAfterBuildState,
    },
  ];
  const type2 = [
    {
      id: 1,
      icon: Hotel,
      text: 'Квартира',
      background: hotelBackground,
      borderColor: Colors.green,
      state: hotelState,
      setState: setHotelState,
    },
    {
      id: 2,
      icon: Office,
      text: 'Офис',
      background: officeBackground,
      borderColor: Colors.blue,
      state: officeState,
      setState: setOfficeState,
    },
    {
      id: 3,
      icon: Home,
      text: 'Загородный дом',
      background: homeBackground,
      borderColor: Colors.orange,
      state: homeState,
      setState: setHomeState,
    },
    {
      id: 4,
      icon: Coffee,
      text: 'Кафе или ресторан',
      background: cafeBackground,
      borderColor: Colors.red,
      state: cafeState,
      setState: setCafeState,
    },
  ];
  const addAdditions = arr => {
    setAdditions(arr);
  };
  const goToAdditions = () => {
    let typeClean = regularState
      ? 'type_regular'
      : generalState
      ? 'type_general'
      : 'type_after_repair';
    let typeBuilding = officeState
      ? 'type_building_office'
      : hotelState
      ? 'type_building_flat'
      : homeState
      ? 'type_building_house'
      : 'type_building_cafe';
    navigation.navigate('Дополнительные услуги', {
      addAdditions,
      additions,
      typeClean,
      typeBuilding,
    });
  };
  const openPayment = token => {
    refRBSheet.current.close();
    navigation.navigate('Платеж', {modal: refRBSheet, token});
  };
  const openModal = () => {
    Keyboard.dismiss();
    if (squareMeter === '') {
      setErrorField(true);
      errorFetchCalculator();
    } else {
      if (timeValue === 'Время' || dateValue === 'Дата') {
        errorChooseDateOrTime();
      } else {
        // mainFlatList.scrollToEnd({animated: false});
        const object = {};
        object.typeClean = regularState
          ? 'Регулярная уборка'
          : generalState
          ? 'Генеральная уборка'
          : 'После ремонта';
        object.typeBuilding = hotelState
          ? 'Квартира'
          : officeState
          ? 'Офис'
          : homeState
          ? 'Загородный дом'
          : 'Общепит';
        object.square = Number(squareMeter);
        object.doors = doorCount === '' ? 0 : Number(doorCount);
        object.windows = windowCount === '' ? 0 : Number(windowCount);
        object.toilets = toiletCount === '' ? 0 : Number(toiletCount);
        object.address = address;
        object.flatNumber = Number(flat);
        object.mkad = Number(mileageMkad) ?? 0;
        object.comment = comment;
        object.date = dateValue;
        object.time = timeValue;
        object.region = {...region};
        let arr = [];
        additions.map(item => {
          if (item.count > 0) {
            arr.push({id: item.id, quantity: item.count});
          } else {
            return;
          }
        });
        object.extra = arr;
        setInfo(object);
        refRBSheet.current.open();
        // setScroll(false);
      }
    }
  };
  const refRBSheet = useRef();
  return isPending ? (
    <Preloader />
  ) : (
    <FlatList
      data={['1']}
      ref={mainFlatList}
      scrollEnabled={isScroll}
      style={{flex: 1, backgroundColor: 'white'}}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <View>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            height={width}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}>
            <PaymentModal
              openPayment={openPayment}
              navigation={navigation}
              info={info}
              bonusSize={bonusSize}
              allSum={allSum}
              bonusSum={bonusSum}
              setScroll={setScroll}
              modal={refRBSheet}
            />
          </RBSheet>
          {/*<Portal>*/}
          {/*  <PaymentModal openPayment={openPayment} navigation={navigation} info={info} bonusSize={bonusSize} allSum={allSum}*/}
          {/*                bonusSum={bonusSum} setScroll={setScroll} setModalOpen={setModalOpen} ref={el => (modal = el)} />*/}
          {/*</Portal>*/}
          <SafeAreaView style={styles.container}>
            <Text style={[styles.text, {marginHorizontal: width * 0.05}]}>
              Тип уборки
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                zIndex: 3,
              }}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                ref={cleanFlatList}
                keyExtractor={item => String(item.id)}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={type1}
                renderItem={({item}) => (
                  <View>
                    <View
                      style={{
                        padding: 2,
                        borderRadius: 21,
                        borderWidth: item.state ? 1 : 0,
                        borderColor: item.borderColor,
                        marginHorizontal: width * 0.07,
                        marginRight: item.id === 3 ? 23 : 0,
                      }}>
                      <TouchableOpacity
                        style={{width: 230, height: 130, borderRadius: 18}}
                        onPress={() => {
                          setRegularState(false);
                          setGeneralState(false);
                          setAfterBuildState(false);
                          item.setState(true);
                        }}>
                        <item.background style={{position: 'absolute'}} />
                        <View style={{paddingLeft: 9, paddingRight: 14}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: 12,
                            }}>
                            <item.icon />
                            {item.state ? (
                              <Radio width={24} height={24} />
                            ) : null}
                          </View>
                          <Text style={styles.textType}>{item.text}</Text>
                          <View style={{marginTop: 30}}>
                            <Plus />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
            <Text
              style={[
                styles.text,
                {marginTop: width * 0.09, marginHorizontal: width * 0.07},
              ]}>
              Тип помещения
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                ref={buildFlatList}
                keyExtractor={item => String(item.id)}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={type2}
                renderItem={({item}) => (
                  <View>
                    <View
                      style={{
                        padding: 2,
                        borderRadius: 23,
                        borderWidth: item.state ? 1 : 0,
                        borderColor: item.borderColor,
                        marginHorizontal: width * 0.07,
                        marginRight: item.id === 4 ? 23 : 0,
                      }}>
                      <TouchableOpacity
                        style={{width: 130, height: 130}}
                        onPress={() => {
                          setHotelState(false);
                          setOfficeState(false);
                          setHomeState(false);
                          setCafeState(false);
                          item.setState(true);
                        }}>
                        <item.background style={{position: 'absolute'}} />
                        <View style={{paddingHorizontal: 14, zIndex: 1000}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: 12,
                            }}>
                            <item.icon />
                            {item.state ? (
                              <Radio width={24} height={24} />
                            ) : null}
                          </View>
                          <Text style={styles.textType}>{item.text}</Text>
                          <View style={{marginTop: item.id < 3 ? 30 : 10}}>
                            <Plus />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
            <Text
              style={[
                styles.text,
                {marginTop: width * 0.09, marginHorizontal: width * 0.07},
              ]}>
              Площадь помещения
            </Text>
            <View
              style={[
                styles.input,
                {
                  marginHorizontal: width * 0.07,
                  borderWidth: isErrorField && squareMeter === '' ? 2 : 0,
                  borderColor: 'red',
                },
              ]}>
              <TextInput
                value={squareMeter}
                onChangeText={setSquareMeter}
                placeholder="0"
                placeholderTextColor={Colors.violet}
                style={[
                  styles.inputField,
                  {width: width * 0.11, paddingLeft: '12%'},
                ]}
                keyboardType="numeric"
              />
              <View style={styles.textContainer}>
                <Text style={[styles.text, {color: Colors.violet}]}>м</Text>
                <Text style={styles.sup}>2</Text>
              </View>
            </View>
            <View style={[styles.objects, {marginHorizontal: width * 0.07}]}>
              <View>
                <Text
                  style={[
                    styles.text,
                    {
                      marginTop: width * 0.09,
                      marginLeft: width * 0.015,
                    },
                  ]}>
                  Дверей
                </Text>
                <View style={[styles.input]}>
                  <TextInput
                    value={doorCount}
                    onChangeText={setDoorCount}
                    placeholder="0"
                    style={styles.inputField}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.violet}
                  />
                </View>
              </View>
              <View style={styles.objectItem}>
                <Text
                  style={[
                    styles.text,
                    {
                      marginTop: width * 0.09,
                      marginLeft: width * 0.015,
                    },
                  ]}>
                  Окон
                </Text>
                <View style={[styles.input]}>
                  <TextInput
                    value={windowCount}
                    onChangeText={setWindowCount}
                    placeholder="0"
                    style={styles.inputField}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.violet}
                  />
                </View>
              </View>
              <View style={styles.objectItem}>
                <Text
                  style={[
                    styles.text,
                    {marginTop: width * 0.09, marginLeft: width * 0.015},
                  ]}>
                  Сан узлов
                </Text>
                <View style={[styles.input]}>
                  <TextInput
                    value={toiletCount}
                    onChangeText={setToiletCount}
                    placeholder="0"
                    style={styles.inputField}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.violet}
                  />
                </View>
              </View>
            </View>
            <MyButton
              title="Дополнительные услуги"
              onPress={goToAdditions}
              marginTop={width * 0.09}
              width={width * 0.85}
            />
            <Text
              style={[
                styles.text,
                {marginTop: width * 0.09, marginHorizontal: width * 0.07},
              ]}>
              Адрес помещения
            </Text>
            <View style={{marginHorizontal: width * 0.07}}>
              <MyInput
                placeholder={'Город, улица, дом'}
                value={address}
                onFocus={() =>
                  navigation.navigate('Карта', {
                    updateAddress,
                    region,
                    initialRegion,
                  })
                }
              />
              <View style={styles.inputRow}>
                <MyInput
                  placeholder={'Квартира/Оф.'}
                  value={flat}
                  onChangeText={setFlat}
                  width={width * 0.4}
                  marginTop={30}
                  keyboardType={'numeric'}
                />
                <View style={styles.paddingView} />
                <MyInput
                  value={mileageMkad}
                  onChangeText={setMileageMkad}
                  marginTop={30}
                  placeholder={'Км от МКАД'}
                  width={width * 0.4}
                  keyboardType={'numeric'}
                />
              </View>
              <MyInput
                marginTop={30}
                value={comment}
                onChangeText={setComment}
                placeholder={'Этаж, особенности прохода, комментарии'}
                multiline={true}
                height={width * 0.3}
              />
              <View pointerEvents="none" style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  scrollEnabled={false}
                  region={region}
                  ref={mapRef}>
                  <Marker coordinate={region}>
                    <MarkerCustom />
                  </Marker>
                </MapView>
              </View>
              <Text style={[styles.text, {marginTop: width * 0.09}]}>
                Дата и время уборки
              </Text>
              <View style={styles.dateTime}>
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={[
                    styles.input,
                    {
                      width: width * 0.4,
                      justifyContent: 'space-between',
                      paddingHorizontal: 24,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        dateValue === 'Дата' ? Colors.violet : Colors.black,
                      fontSize: 15,
                    }}>
                    {dateValue === 'Дата' ? dateValue : dateString}
                  </Text>
                  <Calendar />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    cancelTextIOS={'Отмена'}
                    isDarkModeEnabled={colorPicker === 'dark'}
                    confirmTextIOS={'Подтвердить'}
                    locale="ru_RU"
                    minimumDate={new Date()}
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    headerTextIOS={'Выберите дату'}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showTimePicker}
                  style={[
                    styles.input,
                    {
                      width: width * 0.4,
                      justifyContent: 'space-between',
                      paddingHorizontal: 24,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        timeValue === 'Время' ? Colors.violet : Colors.black,
                      fontSize: 15,
                    }}>
                    {timeValue}
                  </Text>
                  <Time />
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    cancelTextIOS={'Отмена'}
                    isDarkModeEnabled={colorPicker === 'dark'}
                    confirmTextIOS={'Подтвердить'}
                    mode="time"
                    onConfirm={handleConfirmTime}
                    onCancel={hideTimePicker}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.calcText,
                  {
                    fontSize: 20,
                    fontWeight: '500',
                    marginTop: 30,
                    color: Colors.black,
                  },
                ]}>
                Итого: {allSum} руб.
              </Text>
              <Text style={styles.calcText}>
                Стоимость уборки: {cleanSum} руб.
              </Text>
              <Text style={styles.calcText}>
                Стоимость дороги: {roadSum} руб.
              </Text>
              <Text style={styles.calcText}>
                Бонусных рублей начислим: {bonusSum} руб.
              </Text>
              <View style={{marginTop: width * 0.04}}>
                <MyButton
                  title="Заказать уборку"
                  onPress={openModal}
                  width={width * 0.85}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    zIndex: 2,
    marginVertical: width * 0.1,
  },
  inputField: {
    width: width * 0.25,
    height: 55,
    paddingLeft: '40%',
    fontWeight: '400',
    color: Colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
  },
  input: {
    width: width * 0.25,
    height: 55,
    borderRadius: 15,
    marginTop: 15,
    color: Colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: 15,
    backgroundColor: Colors.lightGray,
  },
  textContainer: {
    flexDirection: 'row',
    paddingBottom: width * 0.01,
  },
  text: {
    alignSelf: 'flex-start',
    fontSize: 20,
    color: Colors.black,
    fontWeight: '500',
  },
  sup: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: Colors.violet,
    fontWeight: '500',
  },
  textType: {
    color: 'white',
    fontSize: 15,
    marginTop: 11,
  },
  paddingView: {
    paddingHorizontal: width * 0.024,
  },
  objects: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  objectItem: {
    marginLeft: width * 0.05,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapContainer: {
    marginTop: width * 0.1,
    width: width * 0.85,
    height: width * 0.5,
    borderRadius: 15,
    zIndex: 5,
    overflow: 'hidden',
  },
  map: {
    width: width * 0.84,
    height: width * 0.5,
  },
  dateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: width * 0.03,
  },
  calcText: {
    fontWeight: '400',
    color: Colors.violet,
    fontSize: 15,
    marginTop: 5,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default CalculateRoot;
