import axios from "axios";
import Router from "next/router";
import { getCookie } from "cookies-next";

export const getNotif = async () => {
  try {
    const url = `${process.env.API_URL_MW}/getGimmick`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    const response = await axios.get(url, header);

    return response;
  } catch (err: any) {
    return err.response;
  }
};
