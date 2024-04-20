import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Setting {
  popup: boolean;
  searchType: "tendency" | "speed";
}

interface SettingParams {
  popup?: boolean;
  searchType?: "tendency" | "speed";
}

const initSetting: Setting = {
  popup: false,
  searchType: "tendency"
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