interface PaymentInterface {
  method: any,
  va: any,
  wallet: any,
  reserved: string,
  trxid: string
}

export const initialState: PaymentInterface = {
  method: {},
  va: {},
  wallet: {},
  reserved: "",
  trxid: "",
};