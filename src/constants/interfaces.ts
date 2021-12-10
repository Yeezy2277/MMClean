export interface IGlobalState {
  isSetData: boolean;
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null | undefined;
  isNeedDelete: boolean;
  isBonus: boolean;
  id: number;
  timeCode: number;
  isTime: boolean;
}

export interface IButtonProps {
  width: number;
  marginTop: number;
  marginBottom: number;
  position: string;
  bottom: number;
  disabled: boolean;
  onPress: () => void;
  title: string;
}

export interface IGlobalState {
  id: number;
  isBonus: boolean;
  isLoading: boolean;
  isNeedDelete: boolean;
  isSetData: boolean;
  isSignout: boolean;
  isTime: boolean;
  timeCode: number;
  userToken: string | null | undefined;
}
