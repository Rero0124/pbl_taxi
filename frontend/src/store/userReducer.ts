import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserTendency {
  userId: string;
  inward: boolean;
  quickly: boolean;
  song: boolean;
  songName: string;
}

export interface User {
  id: string;
  name?: string;
  phone?: number;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  init?: boolean;
  tendency?: UserTendency
}

const userSlice = createSlice({
  name: 'user',
  initialState: {id: ''} as User,
  reducers: {
    userSet(state, action: PayloadAction<User>) {
      return action.payload
    },
    userTendencySet(state, action: PayloadAction<UserTendency>) {
      return {
        ...state,
        tendency: action.payload
      }
    },
    userUnset(state) {
      return {id: ''}
    }
  }
})

export const { userSet, userUnset, userTendencySet } = userSlice.actions;
export default userSlice.reducer;