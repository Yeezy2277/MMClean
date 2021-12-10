import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configType, configFormDataType} from './types';

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('userToken');
};

const config: configType = {
  baseURL: 'https://mmclean.ru/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const configFormData: configFormDataType = {
  baseURL: 'https://mmclean.ru/',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
const client = axios.create(config);
const clientFormFata = axios.create(configFormData);
export const authAPI = {
  login(phone: string) {
    return client.post('api/auth/', {phone});
  },
  code(data: object) {
    return client.post('api/code/', data);
  },
};
export const accountAPI = {
  getAccount(token: string) {
    return client.get('api/account/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  updateAccount(token: string, data: object) {
    return clientFormFata.post('api/update-account/', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};

export const supportAPI = {
  getQuestions(token: string) {
    return client.get('api/get-questions/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  getOptions() {
    return client.get('api/get-options/');
  },
  createQuestions(token: string, data: object) {
    return client.post('api/create-questions/', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
};

export const calculateAPI = {
  getAddresses(token: string) {
    return client.get('api/get-all-adress/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  getAddress(token: string, data: object) {
    return client.post('api/get-adress/', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  updateAddress(token: string, data: object) {
    return client.post('api/update-adress/', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  createPayment(token: string, data: object) {
    return client.post('api/create-payment/', data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  confirmPayment(token: string) {
    return client.get('api/confirm-payment/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },
  getOptions() {
    return client.get('api/get-options/');
  },
};
