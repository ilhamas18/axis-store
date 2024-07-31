import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTablePage: (state, action: PayloadAction<number>) => {
      state.tablePage = action.payload;
    }
  }
})

export const { setTablePage } = dataSlice.actions;
const table = dataSlice.reducer;
export default table;