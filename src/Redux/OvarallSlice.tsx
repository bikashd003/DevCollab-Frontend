import { createSlice } from "@reduxjs/toolkit";

export interface Overrall {
    isModalOpen: boolean;
}

const initialState: Overrall = {
    isModalOpen: false,
};
const overallSlice = createSlice({
    name: "overall",
    initialState,
    reducers: {
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        }
    }
})
export const { setIsModalOpen } = overallSlice.actions;
export default overallSlice.reducer;