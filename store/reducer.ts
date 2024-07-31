import { combineReducers } from "redux";
import delivery from "./delivery/action";
import payment from "./payment/action";
import personal from "./personal/action";
import product from "./product/action";
import payload from "./payload/action";
import page from "./step-page/action";
import msisdn from "./msisdn/action";
import table from "./table/action";
import register from "./register/action";
import uuid from "./uuid/action";

const combinedReducer = combineReducers({
  delivery,
  payment,
  personal,
  product,
  payload,
  page,
  msisdn,
  table,
  register,
  uuid
})

export default combinedReducer;

export type State = ReturnType<typeof combinedReducer>;