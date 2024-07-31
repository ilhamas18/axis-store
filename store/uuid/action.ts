import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "uuid",
  initialState,
  reducers: {
    setUuid: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    }
  }
})

export const { setUuid } = dataSlice.actions;
const uuid = dataSlice.reducer;
export default uuid;