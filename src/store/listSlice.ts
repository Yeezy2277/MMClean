import {createSlice} from '@reduxjs/toolkit';

export type ListState = {
  userToken: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isSetData: boolean;
  id: number;
  isNeedDelete: boolean;
  isBonus: boolean;
  isTime: boolean;
  timeCode: number;
};

const initialState: ListState = {
  userToken: 'dummy-auth-token',
  isLoading: true,
  isSignout: true,
  isSetData: false,
  id: 1,
  isNeedDelete: false,
  isBonus: false,
  isTime: false,
  timeCode: 0,
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    restoreToken: (state, action) => {
      state.userToken = action.payload;
      state.isLoading = false;
    },
    signIn: state => {
      state.isSignout = false;
      state.userToken = 'dummy-auth-token';
    },
    signOut: state => {
      state.isSignout = true;
      state.userToken = null;
    },
    unSetDataCalculator: state => {
      state.isSignout = false;
      state.isSetData = false;
      state.userToken = 'dummy-auth-token';
    },
    setDataCalculator: (state, action) => {
      state.isSignout = false;
      state.isSetData = true;
      state.userToken = 'dummy-auth-token';
      state.id = action.payload;
    },
    deleteInfoFromCalculator: state => {
      state.isSignout = false;
      state.userToken = 'dummy-auth-token';
      state.isNeedDelete = true;
    },
    cancelDeleteInfoFromCalculator: state => {
      state.isSignout = false;
      state.userToken = 'dummy-auth-token';
      state.isNeedDelete = false;
    },
    updateBonusBalance: state => {
      state.isSignout = false;
      state.userToken = 'dummy-auth-token';
      state.isBonus = true;
    },
    setTimeCode: (state, action) => {
      state.isSignout = false;
      state.isTime = action.payload;
    },
    setTimeCodeValue: (state, action) => {
      state.isSignout = false;
      state.timeCode = action.payload;
    },
  },
});
export const {
  restoreToken,
  signIn,
  signOut,
  unSetDataCalculator,
  setDataCalculator,
  deleteInfoFromCalculator,
  cancelDeleteInfoFromCalculator,
  updateBonusBalance,
  setTimeCode,
  setTimeCodeValue,
} = listSlice.actions;
export default listSlice.reducer;
