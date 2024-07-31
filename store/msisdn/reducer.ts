interface MsisdnInterface {
  number: any,
  listNumber: any,
  minPage: number,
  maxPage: number,
  error: any
}

export const initialState: MsisdnInterface = {
  number: [],
  listNumber: [],
  minPage: 1,
  maxPage: 4,
  error: []
}
