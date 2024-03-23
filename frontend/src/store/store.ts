import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";

export const useStore = configureStore({
  reducer: {
    user: userReducer
  }
})

export type RootState = ReturnType<typeof useStore.getState>;
export type AppDispatch = typeof useStore.dispatch;