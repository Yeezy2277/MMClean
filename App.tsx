import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './src/constants/types';
import LoginScreen from './src/screens/Auth/LoginScreen';
import CodeScreen from './src/screens/Auth/CodeScreen';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from './src/store/store';
import {restoreToken, signIn} from './src/store/listSlice';
import AccountRootScreen from './src/screens/Main/AccountRootScreen';
import AccountContainer from './src/screens/Main/AccountScreen';
import {requestPermissions} from './src/utils/getLocation';
import AppMetrica from 'react-native-appmetrica';

const Stack = createStackNavigator<RootStackParamList>();

const App = (): JSX.Element => {
  AppMetrica.activate({
    apiKey: 'd960c467-8d83-4332-bc5b-46888bfc77e5',
    sessionTimeout: 120,
    firstActivationAsUpdate: true,
  });
  const commonState = useSelector((state: rootState) => state.list);
  const dispatch = useDispatch();
  useEffect(() => {
    AppMetrica.reportEvent('My event');
    AppMetrica.reportEvent('My event', {foo: 'bar'});
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async (): Promise<void> => {
      let userToken: string | undefined | null;
      try {
        console.log(`userToken - ${commonState.userToken}`);
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      dispatch(restoreToken(userToken));
    };

    bootstrapAsync();
  }, [commonState.userToken, dispatch]);

  return (
    <NavigationContainer>
      {commonState.userToken === null ? (
        <Stack.Navigator
          screenOptions={{
            headerTitle: '',
            headerBackTitle: 'Назад',
            headerTransparent: true,
          }}>
          <Stack.Screen name="SignIn" component={LoginScreen} />
          <Stack.Screen name="Code" component={CodeScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerTitle: '',
            headerBackTitle: 'Назад',
          }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Home"
            component={AccountRootScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default App;
