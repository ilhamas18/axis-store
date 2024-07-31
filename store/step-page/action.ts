import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPageStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    }
  }
})

export const { setPageStep } = dataSlice.actions;
const page = dataSlice.reducer;
export default page;