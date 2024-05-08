import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Popup {
  display: number;
  type: string;
  title: string;
  content: string;
}

export interface PopupParam {
  title: string;
  type: string;
  content: string;
}

const initPopup: Popup = {
  display: 0,
  type: "",
  title: "",
  content: ""
}

const popupSlice = createSlice({
  name: 'popupSlice',
  initialState: initPopup,
  reducers: {
    popupSet(state, action: PayloadAction<PopupParam>) {
      return { ...state, ...action.payload };
    },
    popupShow(state) {
      return { ...state, display: 1 };
    },
    popupClose(state) {
      return { ...state, display: 0 };
    }
  }
})

export const { popupSet, popupShow, popupClose } = popupSlice.actions;
export default popupSlice.reducer;