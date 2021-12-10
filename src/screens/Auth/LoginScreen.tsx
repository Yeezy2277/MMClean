import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
  FlatList,
} from 'react-native';
import LogoSvg from '../../components/Svg/logoSvg.svg';
import {TextInputMask} from 'react-native-masked-text';
import MyButton from '../../components/MyButton';
import CheckboxFalseSvg from '../../components/Svg/CheckboxFalseSvg.svg';
import CheckboxTrueSvg from '../../components/Svg/CheckboxTrueSvg.svg';
import {Host, Portal} from 'react-native-portalize';
import {OfferModal} from '../../modals/OfferModal';
import {ConfidencialModal} from '../../modals/ConfidencialModal';
import {Props} from '../../constants/types';
import {Colors} from '../../constants/Colors';
import {authAPI} from '../../constants/api';
import {AxiosResponse} from 'axios';
import {Modalize} from 'react-native-modalize';
import {errorLogin} from '../../constants/alerts';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../store/store';
import {setTimeCode, setTimeCodeValue} from '../../store/listSlice';
import {IHandles} from 'react-native-modalize/lib/options';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const LoginScreen = ({navigation}: Props): JSX.Element => {
  const commonState = useSelector((state: rootState) => state.list);
  const dispatch = useDispatch();
  let modalOffer: IHandles | undefined | null = useRef<Modalize>().current;
  let modalConfidencial: IHandles | undefined | null =
    useRef<Modalize>().current;
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);

  const [input, setInput] = useState('');
  const [phoneField, setPhoneField] = useState<any>();
  const [isPending, setIsPending] = useState(false);

  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');
  const _keyboardDidShow = (): void => {
    setKeyboardStatus('Keyboard Shown');
  };
  const _keyboardDidHide = (): void => {
    setKeyboardStatus('Keyboard Hidden');
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, []);
  useEffect(() => {
    console.log(commonState);
  }, [commonState]);
  const onSubmit = () => {
    setIsPending(true);
    authAPI
      .login(phoneField.getRawValue())
      .then((r: undefined | AxiosResponse) => {
        if (r === undefined) {
          errorLogin();
        } else {
          dispatch(setTimeCodeValue(30));
          dispatch(setTimeCode(true));
          phoneField.getRawValue();
          navigation.navigate('Code', {phone: phoneField.getRawValue()});
        }
      })
      .catch(err => {
        errorLogin();
        console.log(err);
      });
  };

  useEffect(() => {
    if (commonState.isTime) {
      if (commonState.timeCode > 0) {
        !isPending ? setIsPending(true) : null;
        setTimeout(() => {
          return dispatch(
            setTimeCodeValue(--commonState.timeCode),
          );
        }, 1000);
      } else if (commonState.timeCode <= 0) {
        dispatch(setTimeCode(false));
      }
    }
    if (!commonState.isTime) {
      isPending ? setIsPending(false) : null;
    }
  }, [dispatch, isPending, commonState]);
  const disabled = !agree1 || !agree2 || input.length < 18 || isPending;
  return (
    <Host>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          data={['1']}
          renderItem={({}) => (
            <View
              style={
                keyboardStatus === 'Keyboard Shown'
                  ? [styles.container, {justifyContent: 'flex-start'}]
                  : styles.container
              }>
              <Portal>
                <OfferModal ref={(el: null) => (modalOffer = el)} />
                <ConfidencialModal
                  ref={(el: null) => (modalConfidencial = el)}
                />
              </Portal>
              {keyboardStatus === 'Keyboard Shown' ? (
                <LogoSvg width={width * 0.3} height={width * 0.44} />
              ) : (
                <LogoSvg
                  width={width > 1000 ? width * 0.3 : width * 0.5}
                  height={width > 1000 ? width * 0.4 : width * 0.9}
                />
              )}
              <View>
                <Text style={styles.textTitle}>Введите номер телефона</Text>
                <TextInputMask
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '+7 (999) 999-99-99 ',
                  }}
                  onSubmitEditing={Keyboard.dismiss}
                  value={input}
                  onChangeText={value => setInput(value)}
                  ref={(ref): void => setPhoneField(ref)}
                  keyboardType={'numeric'}
                  maxLength={18}
                  style={styles.input}
                  placeholder={'+7 (900) 000-00-00'}
                  placeholderTextColor={'#6E7191'}
                />
              </View>
              <MyButton
                title={
                  commonState.isTime
                    ? `Доступно через ${commonState.timeCode}`
                    : 'Вход'
                }
                onPress={onSubmit}
                disabled={disabled}
              />
              <View style={styles.checkboxes}>
                <View>
                  <View style={styles.checkboxItem}>
                    <TouchableOpacity
                      onPress={() =>
                        !agree1 ? setAgree1(true) : setAgree1(false)
                      }>
                      {agree1 ? (
                        <CheckboxTrueSvg height={48} width={48} />
                      ) : (
                        <CheckboxFalseSvg height={48} width={48} />
                      )}
                    </TouchableOpacity>
                    <View>
                      <Text
                        style={[
                          styles.checkboxText,
                          {marginLeft: width * 0.03},
                        ]}>
                        Даю согласие на обработку
                      </Text>
                      <TouchableOpacity
                        style={{marginLeft: width * 0.03}}
                        onPress={() => modalConfidencial!.open()}>
                        <Text
                          style={[
                            styles.checkboxText,
                            {textDecorationLine: 'underline'},
                          ]}>
                          персональных данных
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.checkboxItem}>
                    <TouchableOpacity
                      onPress={() =>
                        !agree2 ? setAgree2(true) : setAgree2(false)
                      }>
                      {agree2 ? (
                        <CheckboxTrueSvg height={48} width={48} />
                      ) : (
                        <CheckboxFalseSvg height={48} width={48} />
                      )}
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginLeft: width * 0.03,
                      }}>
                      <TouchableOpacity
                        style={{flexDirection: 'row'}}
                        onPress={() => modalOffer!.open()}>
                        <Text
                          style={{
                            fontSize: 12,
                            lineHeight: 14,
                            color: Colors.violet,
                            textDecorationLine: 'underline',
                            fontWeight: '500',
                          }}>
                          Договор оферту{' '}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 14,
                          color: Colors.violet,
                          fontWeight: '500',
                        }}>
                        {' '}
                        принимаю.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </Host>
  );
};
const styles = StyleSheet.create({
  container: {
    height,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: height * 0.045,
  },
  textTitle: {
    fontWeight: '400',
    fontSize: 15,
    color: '#6E7191',
    textAlign: 'center',
  },
  input: {
    width: width * 0.75,
    height: 55,
    borderRadius: 16,
    marginTop: width * 0.04,
    backgroundColor: Colors.lightGray,
    color: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    paddingLeft: width * 0.06,
  },
  checkboxes: {
    marginTop: width * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.75,
    height: width * 0.08,
  },
  checkboxItem: {
    marginTop: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxImg: {
    width: 48,
    height: 48,
  },
  checkboxText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.violet,
  },
});
export default LoginScreen;
