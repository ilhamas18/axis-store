interface DeliveryInterface {
  province: any,
  city: string,
  cityType: string,
  district: any,
  subdistrict: any,
  zipcode: any,
  detail: any,
  courier: any
}

export const initialState: DeliveryInterface = {
  province: "",
  city: "",
  cityType: "",
  district: "",
  subdistrict: "",
  zipcode: "",
  detail: {},
  courier: {},
};