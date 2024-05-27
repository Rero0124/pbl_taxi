import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Popup {
  display: boolean;
  type: string;
  data: any;
}

export interface PopupParam {
  type: string;
  data: any;
}

const initPopup: Popup = {
  display: false,
  type: "",
  data: ""
}

const popupSlice = createSlice({
  name: 'popupSlice',
  initialState: initPopup,
  reducers: {
    popupSet(state, action: PayloadAction<PopupParam>) {
      return { ...state, ...action.payload };
    },
    popupUnSet() {
      return initPopup;
    },
    popupShow(state) {
      return { ...state, display: true };
    },
    popupClose(state) {
      return { ...state, display: false };
    }
  }
})

export const { popupSet, popupUnSet, popupShow, popupClose } = popupSlice.actions;
export default popupSlice.reducer;