import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { ProfileState } from "./ProfileSlice"
import overallReducer, { Overrall } from "./OvarallSlice"

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    overall: overallReducer
  },

});

export type RootState = {
  profile: ProfileState;
  overall: Overrall;
};

export type AppDispatch = typeof store.dispatch;

export default store;
