import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ModalPickerItem = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.container}>
      <View style={styles.modal}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          data={props.options}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.option}
              key={index}
              onPress={() => onPressItem(item)}>
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: width * 0.9,
    height: height * 0.8,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    margin: width * 0.05,
    fontWeight: '500',
  },
});

export default ModalPickerItem;
