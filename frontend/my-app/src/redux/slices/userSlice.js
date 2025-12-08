import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: JSON.parse(localStorage.getItem("user")) || { token: null },
  reducers: {
    addUser(state, action) {
      (state.name = action.payload.name),
        (state.email = action.payload.email),
        (state.token = action.payload.token),
        (state._id = action.payload._id);
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    deleteUser(state, action) {},
    updateUser(state, action) {},
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
