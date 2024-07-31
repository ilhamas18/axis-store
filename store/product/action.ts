import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<any>) => {
      state.product = action.payload;
    },
    setProductESim: (state, action: PayloadAction<any>) => {
      state.productESim = action.payload;
    }
  }
})

export const { setProduct, setProductESim } = dataSlice.actions;
const product = dataSlice.reducer;
export default product;