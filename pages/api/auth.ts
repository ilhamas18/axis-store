import axios from "axios";
import { setCookie } from "nookies"

export const getToken = async () => {
  const url = `${process.env.API_URL_MW}/auth/tokenjwt`;
  const header = {
    headers: {
      Authorization: process.env.AUTH_MW,
    },
  };

  try {
    const response = await axios.post(url, {}, header);

    const date = new Date();
    date.setMinutes(date.getMinutes() + 55);

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000));
    const options = {
      expires: expirationDate,
      path: "/",
    };
    setCookie(null, "refreshToken", response?.data?.result?.data?.token, options);

    return response?.data?.result?.data?.token;
  } catch (err: any) {
    return err.response;
  }
};
