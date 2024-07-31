import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setAddrProvince: (state, action: PayloadAction<any>) => {
      state.province = action.payload;
    },
    setAddrCity: (state, action: PayloadAction<any>) => {
      state.city = action.payload;
    },
    setAddrCityType: (state, action: PayloadAction<any>) => {
      state.cityType = action.payload;
    },
    setAddrDistrict: (state, action: PayloadAction<any>) => {
      state.district = action.payload;
    },
    setAddrSubDistrict: (state, action: PayloadAction<any>) => {
      state.subdistrict = action.payload;
    },
    setAddrZipCode: (state, action: PayloadAction<any>) => {
      state.zipcode = action.payload;
    },
    setAddrDetailInfo: (state, action: PayloadAction<any>) => {
      state.detail = action.payload;
    },
    setCourier: (state, action: PayloadAction<any>) => {
      state.courier = action.payload;
    }
  }
})

export const {
  setAddrProvince,
  setAddrCity,
  setAddrCityType,
  setAddrDistrict,
  setAddrSubDistrict,
  setAddrZipCode,
  setAddrDetailInfo,
  setCourier
} = dataSlice.actions;
const delivery = dataSlice.reducer;
export default delivery;
