import React, {FC} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Preloader: FC = () => {
  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        },
        StyleSheet.absoluteFillObject,
      ]}>
      <Image
        source={{
          uri: 'https://i.imgur.com/bfj4YZJ.gif',
        }}
        style={{width: 300, height: 300}}
      />
    </View>
  );
};

export default Preloader;
