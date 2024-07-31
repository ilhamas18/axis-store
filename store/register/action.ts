import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegister: (state, action: PayloadAction<any>) => {
      state.register = action.payload;
    }
  }
})

export const { setRegister } = dataSlice.actions;
const register = dataSlice.reducer;
export default register;