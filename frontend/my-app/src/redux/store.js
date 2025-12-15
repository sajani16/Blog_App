import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import commentSlice from "./slices/commentSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    comment: commentSlice,
  },
});

export default store;
