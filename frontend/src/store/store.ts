import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import locationReducer from "./locationReducer";

export const useStore = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type RootState = ReturnType<typeof useStore.getState>;
export type AppDispatch = typeof useStore.dispatch;