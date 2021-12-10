import {Alert} from 'react-native';
import {Modalize} from 'react-native-modalize';
import { IHandles } from "react-native-modalize/lib/options";
import RBSheet from "react-native-raw-bottom-sheet";
import { Ref } from "react";

// Calculator
export const calculateLocationError = (getInitialState: () => void) =>
  Alert.alert(
    'Не удалось получить ваше местоположение',
    'Нажмите `хорошо`, чтобы попробовать еще раз',
    [
      {
        text: 'Хорошо',
        onPress: () => getInitialState(),
      },
    ],
  );
export const errorChooseDateOrTime = () =>
  Alert.alert('Ошибка', 'Выберите для начала дату и время уборки', [
    {
      text: 'Хорошо',
      onPress: () => null,
    },
  ]);
export const successOrder = (modal) =>
  Alert.alert(
    'Успешно',
    'Вы оформили заказ на уборку. Вам придет SMS с подтверждением.',
    [
      {
        text: 'Хорошо',
        onPress: () => modal.current.close(),
      },
    ],
  );
export const successFree = (modal) =>
  Alert.alert(
    'Успешно',
    'Вы оплатили свой заказ бонусами. Вам придет SMS с подтверждением.',
    [
      {
        text: 'Хорошо',
        onPress: () => modal.current.close(),
      },
    ],
  );
//

// Login
export const errorLogin = () =>
  Alert.alert('Ошибка', 'Не удалось войти в аккаунт. Попробуйте еще раз', [
    {
      text: 'Хорошо',
      onPress: () => null,
    },
  ]);
export const errorFetchCalculator = () =>
  Alert.alert('Ошибка', 'Заполните обязательные поля', [
    {
      text: 'Хорошо',
      onPress: () => null,
    },
  ]);
export const errorCode = () =>
  Alert.alert('Ошибка', 'Вы ввели неверный код.', [
    {
      text: 'Хорошо',
      onPress: () => null,
    },
  ]);
export const commonError = () =>
  Alert.alert('Ошибка', 'Что-то пошло не так. Попробуйте еще раз', [
    {
      text: 'Хорошо',
      onPress: () => null,
    },
  ]);
//

// Support

export const alertQuestion = () =>
  Alert.alert(
    'Успешно',
    'Вы отправили вопрос в тех.поддержку. Он будет рассмотрен в ближайшее время.',
    [
      {
        text: 'Хорошо',
        onPress: () => null,
      },
    ],
  );
//
// Account
export const profileAlertSuccess = () =>
  Alert.alert('Успешно', 'Вы изменили данные.', [
    {
      text: 'Окей',
      onPress: () => null,
    },
  ]);
export const profileAlertError = () =>
  Alert.alert('Ошибка', 'Не удалось отправить данные. Попробуйте еще раз', [
    {
      text: 'Окей',
      onPress: () => null,
    },
  ]);
