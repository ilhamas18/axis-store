import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    setPersonal: (state, action: PayloadAction<any>) => {
      state.personal = action.payload
    }
  }
})

export const { setPersonal } = dataSlice.actions;
const personal = dataSlice.reducer;
export default personal;