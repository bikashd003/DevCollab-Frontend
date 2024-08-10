import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { ProfileState } from "./ProfileSlice"

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = {
  profile: ProfileState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
