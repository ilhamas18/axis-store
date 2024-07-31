import axios from "axios";
import { getToken } from "./auth";
import { getCookie } from "cookies-next";

export const checkFreshImei = async (imei: any, token: any, uuid: string) => {
  const url = `${process.env.API_URL_MW}/checkIMEI`;
  const header = {
    headers: {
      Authorization: `Bearer ${getCookie("refreshToken")}`,
    },
  };
  const data = {
    imei: imei,
    captcharesponse: token,
    uuid
  };
  const resp = await axios.post(url, data, header)
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      return err;
    });

  if (resp.data) {
    return resp.data;
  } else {
    return resp.response;
  }
};
