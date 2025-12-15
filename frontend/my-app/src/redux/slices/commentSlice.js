import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "commentSlice",
  initialState: {
    isOpen: false,
  },
  reducers: {
    setIsOpen(state, action) {
      console.log(action.payload);
      state.isOpen = action.payload === false ? false : !state.isOpen;
    },
  },
});

export const { setIsOpen } = commentSlice.actions;
export default commentSlice.reducer;
