import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import listSlice from './listSlice';

const rootReducer = combineReducers({
  list: listSlice,
});

export type rootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
