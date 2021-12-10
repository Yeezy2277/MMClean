import {createContext, Dispatch, SetStateAction, useContext} from 'react';
import {IGlobalState} from '../constants/interfaces';
import {ActionType} from '../constants/types';
import initialState from './store';
import { createReducer } from "@reduxjs/toolkit";

export type ContextType = {
  globalState: IGlobalState;
  dispatch: Dispatch<ActionType>;
};


export const AuthContext = createContext({
  state: {} as Partial<IGlobalState>,
  dispatch: {} as Dispatch<SetStateAction<Partial<IGlobalState>>>,
});

export const useGlobalState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateContext');
  }
  return context;
};

export const reducer = (state: IGlobalState, action: ActionType) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.payload,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    case 'UNSET_DATA_CALCULATOR': {
      return {
        ...state,
        isSignout: false,
        isSetData: false,
        userToken: 'dummy-auth-token',
      };
    }
    case 'SET_DATA_CALCULATOR':
      return {
        ...state,
        isSignout: false,
        isSetData: true,
        userToken: action.payload,
        id: action.payload,
      };
    case 'DELETE_INFO_FROM_CALCULATOR':
      return {
        ...state,
        isSignout: false,
        userToken: 'dummy-auth-token',
        isNeedDelete: true,
      };
    case 'CANCEL_DELETE_INFO_FROM_CALCULATOR':
      return {
        ...state,
        isSignout: false,
        userToken: 'dummy-auth-token',
        isNeedDelete: false,
      };
    case 'UPDATE_BONUS_BALANCE':
      return {
        ...state,
        isSignout: false,
        userToken: 'dummy-auth-token',
        isBonus: true,
      };
    case 'SET_TIME_CODE':
      return {
        ...state,
        isSignout: false,
        isTime: action.payload,
      };
    case 'SET_TIME_CODE_VALUE':
      return {
        ...state,
        isSignout: false,
        timeCode: action.payload,
      };
    case 'PURGE_STATE':
      return initialState;
  }
};
