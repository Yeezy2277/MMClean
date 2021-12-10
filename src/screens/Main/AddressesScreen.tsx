import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createStackNavigator} from '@react-navigation/stack';
import CirclePlus from '../../components/Svg/CirclePlus.svg';
import {Colors} from '../../constants/Colors';
import MyButton from '../../components/MyButton';
import {calculateAPI} from '../../constants/api';
import {setTokenRequest} from '../../utils/commonFunctions';
import Preloader from '../../components/Preloader';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../store/store';
import {
  cancelDeleteInfoFromCalculator,
  setDataCalculator,
} from '../../store/listSlice';

const width = Dimensions.get('screen').width;

const Stack = createStackNavigator();

const AddressesRoot = ({navigation}) => {
  return (
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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Расчет');
            }}
            style={{paddingRight: 24}}>
            <CirclePlus />
          </TouchableOpacity>
        ),
      }}>
      <Stack.Screen name="Ваши адреса" component={AddressesScreen} />
    </Stack.Navigator>
  );
};

const AddressesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const commonState = useSelector((state: rootState) => state.list);
  const [data, setData] = useState([]);
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    dispatch(cancelDeleteInfoFromCalculator());
    setTokenRequest(calculateAPI.getAddresses).then(r => {
      setData(r.data);
      setIsPending(false);
    });
  }, []);
  const onSubmit = id => {
    navigation.navigate('Расчет');
    dispatch(setDataCalculator(id));
  };
  return isPending ? (
    <Preloader />
  ) : (
    <FlatList
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: 'white'}}
      data={data}
      keyExtractor={index => index.toString()}
      renderItem={({item}) => (
        <SafeAreaView style={styles.container}>
          <View style={styles.item}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>
                {item.adress.premises_type}: {item.adress.area} м2
              </Text>
              <Text style={styles.title}>№{item.id}</Text>
            </View>
            <Text style={styles.description}>{item.adress.adress}</Text>
            {/*<View pointerEvents="none" style={styles.mapContainer}>*/}
            {/*    <MapView style={styles.map} scrollEnabled={false} initialRegion={item.coordinates}>*/}
            {/*        <Marker coordinate={item.coordinates}>*/}
            {/*            <MarkerCustom/>*/}
            {/*        </Marker>*/}
            {/*    </MapView>*/}
            {/*</View>*/}
            <Text style={[styles.title, {marginTop: 10}]}>
              Цена: {item.adress.price} руб
            </Text>
            <MyButton
              onPress={() => onSubmit(item.adress.id)}
              title={'Заказать уборку'}
              width={width * 0.74}
            />
          </View>
        </SafeAreaView>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  rightBtn: {
    width: width * 0.08,
    height: width * 0.08,
    justifyContent: 'flex-end',
  },
  item: {
    borderWidth: 1,
    borderColor: Colors.whiteGray,
    borderRadius: 12,
    width: width * 0.85,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: '500',
  },
  description: {
    lineHeight: 19,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.violet,
    marginTop: 10,
    width: '85%',
  },
  mapContainer: {
    marginTop: 10,
    width: width * 0.85,
    height: width * 0.5,
    zIndex: 1,
    overflow: 'hidden',
    marginBottom: 0,
  },
  map: {
    width: width * 0.74,
    height: width * 0.5,
    marginBottom: 0,
  },
});

export default AddressesRoot;
