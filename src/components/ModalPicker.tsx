import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalPickerItem from './ModalPickerItem';
import {Colors} from '../constants/Colors';
import Svg, {Path} from 'react-native-svg';

const width = Dimensions.get('screen').width;

const ModalPicker = props => {
  const changeModalVisibility = bool => {
    setModalVisible(bool);
  };
  const setData = option => {
    props.setChooseData(option);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    props.callback ? props.callback(props.chooseData) : null;
  }, [props, props.chooseData]);
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.container}
        onPress={() => changeModalVisibility(true)}>
        <Text style={styles.text}>{props.chooseData}</Text>
        <View style={styles.pickerIcon}>
          <Svg width="13" height="8" viewBox="0 0 13 8" fill="none">
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.645917 0.645978C0.692363 0.599415 0.747539 0.562472 0.808284 0.537265C0.869029 0.512059 0.93415 0.499084 0.999917 0.499084C1.06568 0.499084 1.13081 0.512059 1.19155 0.537265C1.2523 0.562472 1.30747 0.599415 1.35392 0.645978L6.99992 6.29298L12.6459 0.645978C12.6924 0.59949 12.7476 0.562614 12.8083 0.537455C12.8691 0.512296 12.9342 0.499346 12.9999 0.499346C13.0657 0.499346 13.1308 0.512296 13.1915 0.537455C13.2522 0.562614 13.3074 0.59949 13.3539 0.645978C13.4004 0.692466 13.4373 0.747655 13.4624 0.808394C13.4876 0.869134 13.5005 0.934234 13.5005 0.999978C13.5005 1.06572 13.4876 1.13082 13.4624 1.19156C13.4373 1.2523 13.4004 1.30749 13.3539 1.35398L7.35392 7.35398C7.30747 7.40054 7.2523 7.43748 7.19155 7.46269C7.13081 7.4879 7.06568 7.50087 6.99992 7.50087C6.93415 7.50087 6.86903 7.4879 6.80828 7.46269C6.74754 7.43748 6.69236 7.40054 6.64592 7.35398L0.645917 1.35398C0.599354 1.30753 0.562411 1.25236 0.537205 1.19161C0.511998 1.13087 0.499023 1.06575 0.499023 0.999978C0.499023 0.934211 0.511998 0.86909 0.537205 0.808344C0.562411 0.747599 0.599354 0.692424 0.645917 0.645978Z"
              fill="black"
            />
          </Svg>
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType={'fade'}
        visible={isModalVisible}
        onRequestClose={() => changeModalVisibility(false)}>
        <ModalPickerItem
          changeModalVisibility={changeModalVisibility}
          setData={setData}
          options={props.options}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    height: 56,
    paddingLeft: 24,
    paddingRight: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    width: width * 0.85,
    backgroundColor: Colors.lightGray,
  },
  text: {
    fontWeight: '400',
    color: Colors.black,
    fontSize: 15,
  },
  pickerIcon: {
    paddingRight: 25,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalPicker;
