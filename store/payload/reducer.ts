interface PayloadInterface {
  selected: any,
  selected_encrypt: any,
  existing: any,
  email: any,
  name: any,
  price: any,
  changeNumber: boolean,
  tncToken: any
}

export const initialState: PayloadInterface = {
  selected: [],
  selected_encrypt: [],
  existing: [],
  email: [],
  name: [],
  price: [],
  changeNumber: false,
  tncToken: []
}