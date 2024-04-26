import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Setting {
  popup: boolean;
  searchType: SettingOptionData;
}

export interface SettingOptionData {
  value: string;
  text: string;
}

interface SettingParams {
  popup?: boolean;
  searchType?: SettingOptionData;
}

const initSetting: Setting = {
  popup: false,
  searchType: {
    value: "tendency",
    text: "성향 검색 - 맞춤형 검색 사용"
  }
}

const settingSlice = createSlice({
  name: 'settingSlice',
  initialState: initSetting,
  reducers: {
    settingSet(state, action: PayloadAction<SettingParams>) {
      return { ...state, ...action.payload };
    },
  }
})

export const { settingSet } = settingSlice.actions;
export default settingSlice.reducer;