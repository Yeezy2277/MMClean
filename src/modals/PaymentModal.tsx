import React, {forwardRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MyButton from '../components/MyButton';
import {Colors} from '../constants/Colors';
import UnToggleCheckbox from '../components/Svg/unToggleCheckbox.svg';
import ToggleCheckbox from '../components/Svg/toggleCheckbox.svg';
import {commonError, successFree, successOrder} from '../constants/alerts';
import {setTokenRequest} from '../utils/commonFunctions';
import {calculateAPI} from '../constants/api';
import {useDispatch} from 'react-redux';
import {
  deleteInfoFromCalculator,
  unSetDataCalculator,
} from '../store/listSlice';

const width = Dimensions.get('screen').width;

const PaymentModal = forwardRef(props => {
  const dispatch = useDispatch();
  const [isBonus, setBonus] = useState(false);
  const updateBonus = () => {
    console.log(isBonus);
    setBonus(!isBonus);
  };
  let finalSum = isBonus
    ? props.bonusSize >= props.allSum
      ? 0
      : props.allSum - props.bonusSize
    : props.allSum;
  let bonus = props.bonusSize >= props.allSum ? props.allSum : props.bonusSize;
  const setWebView = type => {
    console.log(props.info);
    setTokenRequest(calculateAPI.createPayment, {
      booking: {
        date: props.info.date,
        time: props.info.time,
        paid: finalSum,
        payment_tupe: type,
        bonus_size: !isBonus ? 0 : bonus,
        city: 'gulag',
      },
      adress: {
        cleaning_type: props.info.typeClean,
        premises_type: props.info.typeBuilding,
        area: props.info.square,
        door: props.info.doors,
        window: props.info.windows,
        bathroom: props.info.toilets,
        adress: props.info.address,
        flat_or_office: props.info.flatNumber,
        mkad: props.info.mkad,
        price: props.allSum,
        bonuce: props.bonusSum,
        coordinates: props.info.region,
        comment: props.info.comment,
      },
      extra: props.info.extra,
    })
      .then(r => {
        if (r === undefined) {
          commonError();
        } else {
          console.log(props.info);
          if (type === 'card') {
            isBonus && props.bonusSize >= props.allSum
              ? setTokenRequest(calculateAPI.confirmPayment).then(async r => {
                  if (r === undefined) {
                    commonError();
                  } else {
                    successFree(props.modal);
                    console.warn(
                      `allsum ${props.allSum}, bonus ${bonus}, finalsum ${finalSum}`,
                    );
                    await dispatch(unSetDataCalculator());
                    await dispatch(deleteInfoFromCalculator());
                    props.navigation.navigate('Addresses');
                  }
                })
              : props.openPayment(r.data.token);
          } else {
            setTokenRequest(calculateAPI.confirmPayment).then(async r => {
              if (r === undefined) {
                commonError();
              } else {
                successOrder(props.modal);
                await dispatch(unSetDataCalculator());
                await dispatch(deleteInfoFromCalculator());
                props.navigation.navigate('Addresses');
              }
            });
          }
        }
      })
      .catch(() => {
        commonError();
      });
  };

  const renderContent = () => (
    <View style={[s.content, {height: width}]}>
      <View>
        <Text style={{fontSize: 24, fontWeight: '500', textAlign: 'center'}}>
          Способ оплаты
        </Text>
        <MyButton
          title="Оплата с карты"
          onPress={() => setWebView('card')}
          width={width * 0.85}
        />
        <MyButton
          onPress={() => setWebView('cash')}
          title="Наличными сотруднику"
          width={width * 0.85}
        />
        <View style={s.priceBlock}>
          <Text style={s.text}>Стоимость заказа:</Text>
          <Text style={[s.text, {fontWeight: '500', fontSize: 20}]}>
            {finalSum} руб.
          </Text>
        </View>
        <View
          style={[
            s.priceBlock,
            {
              marginTop: 8,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#EFF0F6',
            },
          ]}>
          <Text style={s.text}>У вас бонусов:</Text>
          <Text style={[s.text, {fontWeight: '500', fontSize: 20}]}>
            {isBonus ? props.bonusSize - bonus : props.bonusSize} руб.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: width * 0.05,
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: width * 0.95,
          }}>
          <Text style={s.text}>Использовать бонусы</Text>
          <TouchableOpacity onPress={updateBonus}>
            {isBonus ? <ToggleCheckbox /> : <UnToggleCheckbox />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return renderContent();
});

export default PaymentModal;

const s = StyleSheet.create({
  content: {
    paddingLeft: width * 0.03,
    paddingRight: width * 0.03,
    paddingBottom: 35,
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.black,
  },
  priceBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: width * 0.05,
  },
});
