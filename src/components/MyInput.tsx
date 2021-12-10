import React from 'react';
import {TextInput, StyleSheet, Dimensions, Platform} from 'react-native';
import {Colors} from '../constants/Colors';
import {MyInputType} from '../constants/types';

const width = Dimensions.get('screen').width;

const MyInput = (props: MyInputType): JSX.Element => {
  return (
    <TextInput
      style={
        props.width
          ? [
              styles.input,
              {
                width: props.width,
                marginTop: props.marginTop ? props.marginTop : width * 0.02,
                textAlign: props.textAlignCenter ? 'center' : 'left',
                borderWidth: props.borderWidth ? props.borderWidth : 0,
                borderColor: props.borderColor ? props.borderColor : 'red',
              },
            ]
          : props.height
          ? [
              styles.input,
              {
                height: props.height,
                marginTop: props.marginTop ? props.marginTop : width * 0.02,
                borderWidth: props.borderWidth ? props.borderWidth : 0,
                borderColor: props.borderColor ? props.borderColor : '#fff',
                paddingTop: Platform.OS === 'ios' ? 20 : 0,
              },
            ]
          : styles.input
      }
      placeholder={props.placeholder}
      value={props.value}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onSubmitEditing={props.onSubmitEditing}
      multiline={props.multiline}
      placeholderTextColor={'#6E7191'}
      maxLength={props.maxLength}
      onChangeText={props.onChangeText}
      keyboardType={props.keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: width * 0.85,
    height: 56,
    borderRadius: 16,
    marginTop: width * 0.02,
    color: Colors.violet,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    paddingHorizontal: 24,
    fontSize: 15,
    backgroundColor: Colors.lightGray,
  },
});

export default MyInput;
