import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<object>) => {
      state.method = action.payload;
    },
    setPaymentAccount: (state, action: PayloadAction<object>) => {
      state.va = action.payload;
    },
    setPaymentAccountWallet: (state, action: PayloadAction<object>) => {
      state.wallet = action.payload;
    },
    setReservedNumber: (state, action: PayloadAction<string>) => {
      state.reserved = action.payload;
    },
    setTrxId: (state, action: PayloadAction<string>) => {
      state.trxid = action.payload;
    }
  }
})

export const {
  setPaymentMethod,
  setPaymentAccount,
  setPaymentAccountWallet,
  setReservedNumber,
  setTrxId
} = dataSlice.actions;
const payment = dataSlice.reducer;
export default payment;