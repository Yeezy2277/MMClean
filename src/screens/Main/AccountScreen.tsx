import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyButton from '../../components/MyButton';
import MyInput from '../../components/MyInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPickerItem from '../../components/ModalPickerItem';
import {Colors} from '../../constants/Colors';
import {accountAPI} from '../../constants/api';
import {setTokenRequest} from '../../utils/commonFunctions';
import Preloader from '../../components/Preloader';
import PickerIcon from '../../components/Svg/PickerIcon.svg';
import {Host} from 'react-native-portalize';
import {profileAlertError, profileAlertSuccess} from '../../constants/alerts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AccountLocation from '../../components/Svg/AccountLocation.svg';
import Location from '../../components/Svg/Loc.svg';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../store/store';
import {signOut} from '../../store/listSlice';
import {createStackNavigator} from '@react-navigation/stack';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Stack = createStackNavigator();

const AccountContainer = () => {
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
            locations={[0, 0.5, 0.6]}
            style={[StyleSheet.absoluteFill]}
          />
        ),
      }}>
      <Stack.Screen name="??????????????" component={AccountScreen} />
    </Stack.Navigator>
  );
};

const AccountScreen = () => {
  const dispatch = useDispatch();
  const commonState = useSelector((state: rootState) => state.list);
  const [info, setInfo] = useState({});
  const [isPending, setIsPending] = useState(true);
  const [image, setImage] = useState<Array<any>>([]);
  const [phone, setPhone] = useState(null);
  const options = [
    '???????????????????? ???????? (?????????????? ????????)',
    '?????????????????????? ???????? (????????????????)',
  ];
  const [chooseData, setChooseData] = useState(options[0]);
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setTokenRequest(accountAPI.getAccount)
      .then(r => {
        console.log(r);
        setInfo(r.data.main_info);
        !r.data.main_info.company
          ? setChooseData(options[0])
          : setChooseData(options[1]);
        setPhone(r.data.phone);
        setIsPending(false);
      })
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    commonState.isBonus
      ? setTokenRequest(accountAPI.getAccount).then(r => {
          setInfo(r.data.main_info);
          !r.data.main_info.company
            ? setChooseData(options[0])
            : setChooseData(options[1]);
          setPhone(r.data.phone);
          setIsPending(false);
        })
      : null;
  }, [commonState]);
  useEffect(() => {
    console.log(info);
  }, [info]);
  const onSubmit = () => {
    console.log(info);
    setIsPending(true);
    let formdata = new FormData();
    formdata.append('name', info.name ?? '');
    formdata.append('surname', info.surname ?? '');
    formdata.append('patronymic', info.patronymic ?? '');
    formdata.append('company', chooseData === options[1]);
    formdata.append('inn', info.inn ?? '');
    formdata.append('mail', info.mail ?? '');
    formdata.append('photo', image?.uri ? image : '');
    setTokenRequest(accountAPI.updateAccount, formdata)
      .then(r => {
        setIsPending(false);
        if (r === undefined) {
          profileAlertError();
        } else {
          let obj = {...info};
          obj.company =
            chooseData === options[1] ? '??????????????????????' : '????????????????????';
          setInfo(obj);
          profileAlertSuccess();
        }
      })
      .catch(() => {
        setIsPending(false);
        profileAlertError();
      });
  };
  const changeModalVisibility = (bool: boolean) => {
    setModalVisible(bool);
  };
  const setData = option => {
    setChooseData(option);
  };
  const updateField = (field: string, value: string) => {
    let object = {...info};
    object[field] = value;
    setInfo(object);
  };
  const onLeave = () => {
    AsyncStorage.removeItem('userToken').then(r => {
      dispatch(signOut());
    });
  };
  return isPending ? (
    <Preloader />
  ) : (
    <Host>
      <KeyboardAwareScrollView>
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          style={{flex: 1, backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}>
          <SafeAreaView
            style={[
              styles.container,
              {height: chooseData === options[1] ? height + 360 : height + 130},
            ]}>
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                {/*<TouchableOpacity onPress={openModal}>*/}
                {/*    <Image*/}
                {/*        source={image?.uri ? {uri: image?.uri} : info.photo !== null ? {uri: `http://185.46.11.52/${info.photo}`} : avatar}*/}
                {/*        style={styles.image}/>*/}
                {/*</TouchableOpacity>*/}
                <View style={styles.imageContainer}>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontSize: 17,
                        color: Colors.black,
                      },
                    ]}>
                    +{phone}
                  </Text>
                  <Text style={styles.text}>{info.surname ?? '??????????????'}</Text>
                  <Text style={styles.text}>
                    {info.name ?? '??????'} {info.patronymic ?? '????????????????'}
                  </Text>
                  <Text style={styles.text}>
                    {!info.company ? '????????????????????' : '??????????????????????'} ????????
                  </Text>
                  <Text style={[styles.text, {color: Colors.black}]}>
                    ????????????: {info.bonus_balance} ??????.
                  </Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View style={styles.locBlock}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <AccountLocation />
                    <Text
                      style={{
                        color: '#272338',
                        fontWeight: '400',
                        marginLeft: 12,
                        letterSpacing: 0.75,
                      }}>
                      ???????????? ?? ????
                    </Text>
                  </View>
                  <Location />
                </View>
              </View>
            </View>
            <Text
              style={[
                styles.textTitle,
                {fontWeight: '500', fontSize: 20, marginTop: width * 0.09},
              ]}>
              ??????????????
            </Text>
            <MyInput
              marginTop={15}
              value={info.surname}
              onChangeText={value => updateField('surname', value)}
              placeholder={'????????????'}
            />
            <Text
              style={[
                styles.textTitle,
                {fontWeight: '500', fontSize: 20, marginTop: 30},
              ]}>
              ??????
            </Text>
            <MyInput
              marginTop={15}
              value={info.name}
              onChangeText={value => updateField('name', value)}
              placeholder={'????????'}
            />
            <Text
              style={[
                styles.textTitle,
                {fontWeight: '500', fontSize: 20, marginTop: 30},
              ]}>
              ????????????????
            </Text>
            <MyInput
              marginTop={15}
              value={info.patronymic}
              onChangeText={value => updateField('patronymic', value)}
              placeholder={'????????????????'}
            />
            <Text
              style={[
                styles.textTitle,
                {fontWeight: '500', fontSize: 20, marginTop: 30},
              ]}>
              ?????? ????????????????
            </Text>
            <SafeAreaView>
              <TouchableOpacity
                style={styles.containerModal}
                onPress={() => changeModalVisibility(true)}>
                <Text style={styles.textModal}>{chooseData}</Text>
                <View style={styles.pickerIcon}>
                  <PickerIcon />
                </View>
              </TouchableOpacity>
              <Modal
                transparent={true}
                animationType={'fade'}
                visible={isModalVisible}
                onRequestClose={() => changeModalVisibility(false)}>
                <ModalPickerItem
                  changeModalVisibility={changeModalVisibility}
                  setData={setData}
                  options={options}
                />
              </Modal>
            </SafeAreaView>
            {chooseData === options[1] ? (
              <View>
                <Text
                  style={[
                    styles.textTitle,
                    {fontWeight: '500', fontSize: 20, marginTop: 30},
                  ]}>
                  ?????????????? ?????? ?????? ????????????????
                </Text>
                <MyInput
                  maxLength={12}
                  keyboardType={'numeric'}
                  marginTop={15}
                  value={info.inn}
                  onChangeText={value => updateField('inn', value)}
                  placeholder={'??????'}
                />
                <Text
                  style={[
                    styles.textTitle,
                    {fontWeight: '500', fontSize: 20, marginTop: 30},
                  ]}>
                  E-Mail ?????? ????????????
                </Text>
                <MyInput
                  keyboardType={'email-address'}
                  marginTop={15}
                  value={info.mail}
                  onChangeText={value => updateField('mail', value)}
                  placeholder={'E-Mail'}
                />
              </View>
            ) : null}
            <MyButton
              onPress={onSubmit}
              title={'??????????????????'}
              width={width * 0.85}
            />
            <TouchableOpacity onPress={onLeave}>
              <Text style={{color: Colors.violet, paddingVertical: 15}}>
                ??????????
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Host>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 32,
    paddingHorizontal: width * 0.07,
  },
  headerContainer: {
    backgroundColor: Colors.lightGray,
    width,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 22,
  },
  locBlock: {
    marginTop: width * 0.06,
    width: width * 0.85,
    backgroundColor: 'white',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    marginLeft: width * 0.07,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 48,
    marginTop: 4,
  },
  text: {
    fontWeight: '400',
    marginTop: 2,
    fontSize: 15,
    alignSelf: 'flex-start',
    color: '#6E7191',
  },
  textTitle: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '400',
  },
  containerModal: {
    marginTop: 15,
    height: 56,
    paddingLeft: 24,
    paddingRight: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: Colors.lightGray,
    width: width * 0.85,
  },
  textModal: {
    fontWeight: '400',
    fontSize: 15,
  },
  pickerIcon: {
    paddingRight: 25,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AccountContainer;
