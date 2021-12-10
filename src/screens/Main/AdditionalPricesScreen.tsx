import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MyButton from '../../components/MyButton';
import Preloader from '../../components/Preloader';
import {commonError} from '../../constants/alerts';
import Increment from '../../components/Svg/increment.svg';
import Decrement from '../../components/Svg/decrement.svg';
import {calculateAPI} from '../../constants/api';

const width = Dimensions.get('screen').width;

const AdditionalPrices = ({route, navigation}, props) => {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState([]);

  const onBuy = itemArr => {
    let arr = [...data].map(item => {
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        multiple: item.multiple,
        price: item.price,
        count: itemArr.name === item.name ? item.count + 1 : item.count,
      };
    });
    setData(arr);
  };
  const deleteValue = itemArr => {
    setIsPending(true);
    let arr = [];
    [...data].map(item => {
      arr.push({
        id: item.id,
        name: item.name,
        category: item.category,
        multiple: item.multiple,
        price: item.price,
        count: itemArr.name === item.name ? itemArr.count - 1 : item.count,
      });
    });
    setData(arr);
    setIsPending(false);
  };
  const changeValue = (itemArr, operation) => {
    setIsPending(true);
    let arr = [];
    [...data].map(item => {
      arr.push({
        id: item.id,
        name: item.name,
        category: item.category,
        multiple: item.multiple,
        price: item.price,
        count:
          itemArr.name === item.name
            ? operation === 'add'
              ? itemArr.count + 1
              : itemArr.count - 1
            : item.count,
      });
    });
    setData(arr);
    setIsPending(false);
  };
  const onSubmit = () => {
    route.params.addAdditions(data);
    navigation.navigate('Калькулятор');
  };
  useEffect(() => {
    if (route.params?.additions.length > 0) {
      setData(route.params?.additions);
      setIsPending(false);
    } else {
      calculateAPI.getOptions().then(r => {
        if (r === undefined) {
          commonError();
        } else {
          let arr = [];
          r.data.extra.map(item => {
            let typeBuilding = false;
            let typeClean = false;
            item.typeBuilding.map(item => {
              item === route.params?.typeBuilding
                ? (typeBuilding = true)
                : null;
            });
            item.typeClean.map(item => {
              item === route.params?.typeClean ? (typeClean = true) : null;
            });
            if (typeBuilding && typeClean) {
              arr.push({
                id: item.id,
                name: item.name,
                multiple: item.multiple,
                price: item.price,
                count: 0,
              });
            }
          });
          setData(arr[0] === null ? [] : arr);
          setIsPending(false);
        }
      });
    }
  }, []);
  return isPending ? (
    <Preloader />
  ) : (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: 'white'}}
      data={['1']}
      keyExtractor={() => Math.random().toString()}
      renderItem={({item}) => (
        <View style={s.content__header} key="0">
          <Text style={s.content__heading}>Дополнительные опции</Text>
          <Text
            style={[
              s.content__heading,
              {
                marginTop: 10,
                marginBottom: 7,
                fontSize: 15,
                lineHeight: 19,
                color: '#6E7191',
              },
            ]}>
            Что еще нужно помыть или убрать дополнительно?
          </Text>
          {data.map(item => {
            return (
              <View key="1" style={s.content__item}>
                <Text
                  style={{fontSize: 15, marginTop: width * 0.05, width: '60%'}}>
                  {item.name}
                </Text>
                {item.count > 0 ? (
                  item.multiple ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: width * 0.05,
                      }}>
                      <TouchableOpacity
                        style={s.additionButton}
                        onPress={() => changeValue(item, 'sub')}>
                        <Decrement />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: '#272338',
                          fontSize: 16,
                        }}>
                        {item.count}
                      </Text>
                      <TouchableOpacity
                        style={s.additionButton}
                        onPress={() => changeValue(item, 'add')}>
                        <Increment />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => deleteValue(item)}
                      style={s.deleteButton}>
                      <Text
                        style={{
                          fontWeight: '400',
                          fontSize: 15,
                          color: '#A0A3BD',
                        }}>
                        Удалить
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <MyButton
                    onPress={() => onBuy(item)}
                    width={width * 0.3}
                    title={`${item.price} руб.`}
                  />
                )}
              </View>
            );
          })}
          <MyButton
            width={width * 0.85}
            onPress={onSubmit}
            marginBottom={24}
            marginTop={24}
            title={'Применить'}
          />
        </View>
      )}
    />
  );
};

const s = StyleSheet.create({
  content__header: {
    flex: 1,
    padding: width * 0.07,
    paddingBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,

    fontSize: 20,
    fontWeight: '500',
    color: '#14142B',
  },
  additionButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content__item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#EFF0F7',
  },
  deleteButton: {
    marginTop: width * 0.05,
    width: width * 0.3,
    borderRadius: 12,
    borderColor: '#A0A3BD',
    borderWidth: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdditionalPrices;
