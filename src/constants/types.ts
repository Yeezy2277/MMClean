import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {KeyboardTypeOptions} from 'react-native';
import {Dispatch, SetStateAction} from 'react';

export type RootStackParamList = {
  SignIn: undefined;
  Code: undefined;
  Home: undefined;
};

export type MyInputType = {
  width?: number;
  height?: number;
  marginTop?: number;
  textAlignCenter?: string | boolean;
  borderWidth?: number;
  borderColor?: string;
  paddingTop?: number;
  placeholder?: string;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  maxLength?: number;
  onChangeText?: (text: string) => void | Dispatch<SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions;
};

export type configType = {
  baseURL: 'https://mmclean.ru/';
  headers: {
    Accept: 'application/json';
    'Content-Type': 'application/json';
  };
};

export type configFormDataType = {
  baseURL: 'https://mmclean.ru/';
  headers: {
    'Content-Type': 'multipart/form-data';
  };
};

export type Props = NativeStackScreenProps<
  RootStackParamList,
  ['SignIn', 'Code', 'Home']
>;
export type ProfileScreenNavigationProp = Props['navigation'];
export type ProfileScreenRouteProp = Props['route'];
