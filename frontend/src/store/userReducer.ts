import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name?: string;
  phone?: number;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  init?: boolean;
  tendency?: {
    userId: string;
    inward: boolean;
    quickly: boolean;
    song: boolean;
    songName: string;
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: {id: ''} as User,
  reducers: {
    userSet(state, action: PayloadAction<User>) {
      return action.payload
    },
    userUnset(state) {
      return {id: ''}
    }
  }
})

export const { userSet, userUnset } = userSlice.actions;
export default userSlice.reducer;