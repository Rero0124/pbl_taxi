import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import locationReducer from "./locationReducer";
import settingReducer from "./settingReducer";

export const useStore = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    setting: settingReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type RootState = ReturnType<typeof useStore.getState>;
export type AppDispatch = typeof useStore.dispatch;