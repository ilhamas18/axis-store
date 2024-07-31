import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "payload",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<any>) => {
      state.selected = action.payload;
    },
    setSelectedEncrypt: (state, action: PayloadAction<any>) => {
      state.selected_encrypt = action.payload;
    },
    setExisting: (state, action: PayloadAction<any>) => {
      state.existing = action.payload;
    },
    setEmail: (state, action: PayloadAction<any>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<any>) => {
      state.name = action.payload;
    },
    setPrice: (state, action: PayloadAction<any>) => {
      state.price = action.payload;
    },
    setChangeNumber: (state, action: PayloadAction<any>) => {
      state.changeNumber = action.payload;
    },
    setTnCToken: (state, action: PayloadAction<any>) => {
      state.tncToken = action.payload;
    }
  }
})

export const {
  setSelected,
  setSelectedEncrypt,
  setExisting,
  setEmail,
  setName,
  setPrice,
  setChangeNumber,
  setTnCToken
} = dataSlice.actions;
const payload = dataSlice.reducer;
export default payload;