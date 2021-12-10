import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ModalPicker from '../../components/ModalPicker';
import MyInput from '../../components/MyInput';
import MyButton from '../../components/MyButton';
import PhoneImg from '../../components/Svg/PhoneCall.svg';
import {supportAPI} from '../../constants/api';
import {setTokenRequest} from '../../utils/commonFunctions';
import {alertQuestion, commonError} from '../../constants/alerts';
import Preloader from '../../components/Preloader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createStackNavigator} from '@react-navigation/stack';

const width = Dimensions.get('screen').width;

const Stack = createStackNavigator();

export default function SupportRoot() {
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
      }}>
      <Stack.Screen name="Поддержка" component={SupportScreen} />
    </Stack.Navigator>
  );
}

const SupportScreen = () => {
  const [text, setText] = useState<string | undefined>('');
  const [chooseData, setChooseData] = useState('Вопросы по заказу');
  const [isPending, setIsPending] = useState(false);
  const callPhone = () => {
    const url = 'tel://+79958837929';
    Linking.openURL(url);
  };
  const onSubmit = () => {
    setIsPending(true);
    setTokenRequest(supportAPI.createQuestions, {
      question_type: chooseData,
      answer: null,
      text,
    })
      .then(r => {
        if (r === undefined) {
          commonError();
          setIsPending(false);
        } else {
          alertQuestion();
          setIsPending(false);
        }
      })
      .catch(() => {
        commonError();
        setIsPending(false);
      });
  };
  return isPending ? (
    <Preloader />
  ) : (
    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <Text style={[styles.text, {fontSize: 20, fontWeight: '500'}]}>
            Тип запроса
          </Text>
          <ModalPicker
            setChooseData={setChooseData}
            chooseData={chooseData}
            options={['Вопросы по заказу', 'Вопросы по технической части']}
          />
          <Text
            style={[
              styles.text,
              {fontSize: 20, fontWeight: '500', marginTop: width * 0.06},
            ]}>
            Текст обращения
          </Text>
          <MyInput
            placeholder={'Пожелания, запросы'}
            onChangeText={setText}
            multiline={true}
            marginTop={15}
            height={width * 0.3}
            value={text}
          />
          <MyButton
            title={'Отправить запрос'}
            onPress={onSubmit}
            marginTop={30}
            width={width * 0.85}
          />
          <Text style={[styles.text, {fontSize: 20, fontWeight: '500', marginTop: width * 0.09}]}>
            Телефон поддержки
          </Text>
          <TouchableOpacity onPress={callPhone} style={styles.phone}>
            <PhoneImg />
            <Text
              style={[
                styles.text,
                {
                  fontSize: 24,
                  marginLeft: width * 0.03,
                  alignSelf: 'center',
                },
              ]}>
              +7 (995) 883-79-29
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: width * 0.08,
    paddingHorizontal: width * 0.07,
  },
  text: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '400',
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
  },
  phone: {
    alignSelf: 'flex-start',
    marginTop: width * 0.04,
    flexDirection: 'row',
  },
});
