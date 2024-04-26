import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Popup {
  display: boolean;
  title: string;
  content: string;
}

export interface PopupParam {
  title: string;
  content: string;
}

const initPopup: Popup = {
  display: false,
  title: "",
  content: ""
}

const settingSlice = createSlice({
  name: 'popupSlice',
  initialState: initPopup,
  reducers: {
    popupSet(state, action: PayloadAction<PopupParam>) {
      return { ...state, ...action.payload };
    },
    popupShow(state) {
      return { ...state, display: true };
    },
    popupClose(state) {
      return { ...state, display: false };
    }
  }
})

export const { popupSet, popupShow, popupClose } = settingSlice.actions;
export default settingSlice.reducer;