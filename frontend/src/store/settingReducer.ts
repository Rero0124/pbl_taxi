import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingType {
  searchType: SettingOptionData;
}

export interface SettingOptionData {
  value: string;
  text: string;
}

const initSetting: SettingType = {
  searchType: {
    value: "tendency",
    text: "성향 검색 - 맞춤형 검색 사용"
  }
}

const settingSlice = createSlice({
  name: 'settingSlice',
  initialState: initSetting,
  reducers: {
    settingSet(state, action: PayloadAction<SettingType>) {
      return { ...state, ...action.payload };
    }
  }
})

export const { settingSet } = settingSlice.actions;
export default settingSlice.reducer;