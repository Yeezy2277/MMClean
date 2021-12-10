import React, {FC, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions, View} from 'react-native';
import CalculateRoot from '../Main/CalculateScreen';
import AddressesRoot from './AddressesScreen';
import SupportRoot from './SupportScreen';
import AccountContainer from './AccountScreen';
import Calc1 from '../../components/Svg/calc1.svg';
import Calc2 from '../../components/Svg/calc2.svg';
import Location1 from '../../components/Svg/location1.svg';
import Location2 from '../../components/Svg/location2.svg';
import Support1 from '../../components/Svg/support1.svg';
import Support2 from '../../components/Svg/support2.svg';
import Profile1 from '../../components/Svg/profile1.svg';
import Profile2 from '../../components/Svg/profile2.svg';
import {requestPermissions} from '../../utils/getLocation';

const width = Dimensions.get('screen').width;

const Tab = createBottomTabNavigator();

const AccountRootScreen: FC = () => {
  useEffect(() => {
    requestPermissions().then(r => {
      console.log(r);
    });
  }, []);
  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => {
          return {
            headerShown: false,
            tabBarIcon: ({focused}) => {
              let IconName: FC | undefined;

              if (route.name === 'Calculate') {
                IconName = focused ? Calc2 : Calc1;
              } else if (route.name === 'Addresses') {
                IconName = focused ? Location2 : Location1;
              } else if (route.name === 'Support') {
                IconName = focused ? Support2 : Support1;
              } else if (route.name === 'Account') {
                IconName = focused ? Profile2 : Profile1;
              }

              return (
                <View style={{paddingTop: width * 0.02}}>
                  <IconName />
                </View>
              );
            },
          };
        }}>
        <Tab.Screen
          name="Calculate"
          options={{
            title: '',
          }}
          component={CalculateRoot}
        />
        <Tab.Screen
          name="Addresses"
          options={{
            unmountOnBlur: true,
            title: '',
          }}
          component={AddressesRoot}
        />
        <Tab.Screen
          name="Support"
          options={{
            title: '',
          }}
          component={SupportRoot}
        />
        <Tab.Screen
          name="Account"
          options={{
            title: '',
          }}
          component={AccountContainer}
        />
      </Tab.Navigator>
    </>
  );
};

export default AccountRootScreen;
