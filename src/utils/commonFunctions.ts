import AsyncStorage from '@react-native-async-storage/async-storage';

export const setTokenRequest = async (
  request: (arg0: any, arg1?: any) => any,
  data?: object | null | string | number,
) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return await request(token, data);
  } catch (e) {
    console.log(e);
  }
};
