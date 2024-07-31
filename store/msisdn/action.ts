import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "msisdn",
  initialState,
  reducers: {
    setListNumber: (state, action: PayloadAction<any>) => {
      state.listNumber = action.payload;
    },
    setNumber: (state, action: PayloadAction<any>) => {
      state.number = action.payload;
    },
    setMinPage: (state, action: PayloadAction<any>) => {
      state.minPage = action.payload;
    },
    setMaxPage: (state, action: PayloadAction<any>) => {
      state.maxPage = action.payload;
    }
  }
})

export const {
  setListNumber,
  setNumber,
  setMinPage,
  setMaxPage
} = dataSlice.actions;
const msisdn = dataSlice.reducer;
export default msisdn;
