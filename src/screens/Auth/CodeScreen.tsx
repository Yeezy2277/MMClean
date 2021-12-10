import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
  FlatList,
} from 'react-native';
import LogoSvg from '../../components/Svg/logoSvg.svg';
import MyButton from '../../components/MyButton';
import MyInput from '../../components/MyInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Props} from '../../constants/types';
import {errorCode} from '../../constants/alerts';
import {authAPI} from '../../constants/api';
import {signIn} from '../../store/listSlice';
import {useDispatch} from 'react-redux';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const CodeScreen = ({route}: Props) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState<string>('');
  const [isPending] = useState<boolean>(false);

  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');
  const _keyboardDidShow = () => setKeyboardStatus('Keyboard Shown');
  const _keyboardDidHide = () => setKeyboardStatus('Keyboard Hidden');

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, []);

  const renderItem = () => (
    <View
      style={
        keyboardStatus === 'Keyboard Shown'
          ? [styles.container, {justifyContent: 'flex-start'}]
          : styles.container
      }>
      {keyboardStatus === 'Keyboard Shown' ? (
        <LogoSvg width={width * 0.3} height={width * 0.44} />
      ) : (
        <LogoSvg
          width={width > 1000 ? width * 0.3 : width * 0.5}
          height={width > 1000 ? width * 0.44 : width * 0.9}
        />
      )}
      <Text style={styles.textTitle}>Введите код из SMS</Text>
      <MyInput
        value={input}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={setInput}
        textAlignCenter={true}
        keyboardType={'numeric'}
        marginTop={20}
        maxLength={6}
        width={width * 0.75}
        placeholder={'Код'}
      />
      <MyButton disabled={disabled} title={'Войти'} onPress={onSubmit} />
    </View>
  );
  const onSubmit = () => {
    authAPI
      .code({phone: route.params?.phone, code: input})
      .then((r: {data: {token: string}} | undefined) => {
        if (r === undefined) {
          errorCode();
        } else {
          AsyncStorage.setItem('userToken', r.data.token).then(() => {
            return dispatch(signIn());
          });
        }
      })
      .catch((err: object) => {
        console.log(err);
        errorCode();
      });
  };
  const disabled = isPending;
  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
      data={['1']}
      renderItem={renderItem}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: height * 0.045,
    paddingBottom: width * 0.45,
  },
  logoStyle: {
    width: width > 1000 ? width * 0.3 : width * 0.5,
    height: width > 1000 ? width * 0.44 : width * 0.73,
    alignSelf: 'center',
    marginBottom: width * 0.07,
  },
  logoStyleOnFocus: {
    width: width * 0.3,
    height: width * 0.44,
    alignSelf: 'center',
    marginBottom: width * 0.05,
  },
  textTitle: {
    fontWeight: '400',
    paddingHorizontal: 50,
    fontSize: 15,
    color: '#6E7191',
    textAlign: 'center',
  },
  input: {
    width: width * 0.75,
    height: width * 0.13,
    borderRadius: 16,
    marginTop: width * 0.04,
    backgroundColor: '#EFF0F6',
    color: '#6E7191',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    paddingLeft: width * 0.06,
  },
});
export default CodeScreen;
