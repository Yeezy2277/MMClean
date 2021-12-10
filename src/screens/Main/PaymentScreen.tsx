import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {commonError, successOrder} from '../../constants/alerts';
import {setTokenRequest} from '../../utils/commonFunctions';
import {useDispatch} from 'react-redux';
import {calculateAPI} from '../../constants/api';
import {
  deleteInfoFromCalculator,
  unSetDataCalculator,
} from '../../store/listSlice';

const PaymentScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(route.params.token);
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    const url = 'https://yookassa.ru/';
    currentUrl === url
      ? setTokenRequest(calculateAPI.confirmPayment).then(async r => {
          if (r === undefined) {
            commonError();
          } else {
            successOrder(route.params?.modal);
            await dispatch(unSetDataCalculator());
            await dispatch(deleteInfoFromCalculator());
            navigation.goBack();
            navigation.navigate('Addresses');
          }
        })
      : null;
  }, [currentUrl]);
  const webViewRef = useRef();
  return (
    <WebView
      onNavigationStateChange={state => {
        const currentUrl = state.url;
        setCurrentUrl(currentUrl);
      }}
      ref={webViewRef}
      showsVerticalScrollIndicator={false}
      source={{
        html: `<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Прием платежа с помощью виджета ЮKassa</title>
  <style>
   html { overflow:  hidden; }
  </style>

  <!--Подключение библиотеки для инициализации виджета ЮKassa-->
  <script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"></script>
 </head>
 <body>
  <div id="payment-form"></div>

  <script>
  //Инициализация виджета. Все параметры обязательные.
  const checkout = new window.YooMoneyCheckoutWidget({
      confirmation_token: '${token}',
      return_url: 'https://yookassa.ru/',
      customization: {
        payment_methods: ['bank_card', 'google_pay']
    },
      error_callback: function(error) {
          console.log(error)
      }
  });

  //Отображение платежной формы в контейнере
  checkout.render('payment-form');
  </script>
 </body>
</html>`,
      }}
    />
  );
};

export default PaymentScreen;
