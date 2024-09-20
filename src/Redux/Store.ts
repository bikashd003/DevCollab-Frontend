import { configureStore } from '@reduxjs/toolkit';
import type { ProfileState } from './ProfileSlice';
import profileReducer from './ProfileSlice';
import type { Overrall } from './OvarallSlice';
import overallReducer from './OvarallSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    overall: overallReducer,
  },
});

export type RootState = {
  profile: ProfileState;
  overall: Overrall;
};

export type AppDispatch = typeof store.dispatch;

export default store;
