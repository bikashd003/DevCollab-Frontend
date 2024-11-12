import { createSlice } from '@reduxjs/toolkit';
// import { AppDispatch} from "./Store"
// import { useQuery, gql } from '@apollo/client';

export interface ProfileState {
  isCollapsed: boolean;
}

const initialState: ProfileState = {
  isCollapsed: true,
};
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.isCollapsed = !state.isCollapsed;
    },
    setIsCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
  },
});
export const { toggleSidebar, setIsCollapsed } = profileSlice.actions;

export default profileSlice.reducer;
