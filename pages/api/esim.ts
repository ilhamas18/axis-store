import axios from "axios";
import Router from "next/router";
import { getToken } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "cookies-next";

export const getData = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.API_URL_MW}/getMsisdnEsimNew`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
        data: payload,
      });

      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const getDataFilter = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.API_URL_MW}/getListMsisdnFilters`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
        data: payload,
      });

      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const checkCategoryMsisdn = async (msisdn: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/checkCategoryMsisdn`;
      const header = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const payload = {
        msisdn: msisdn,
      };
      const response = await axios.post(url, payload, header);

      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const statusNumber = async (number: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/reserveMsisdnEsim`;
      const header = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const payload = {
        msisdn: number,
      };
      const response = await axios.post(url, payload, header);
      return response;
    } catch (err: any) {
      if (err.response.status == 403) {
        const token = await getToken();
        if (token !== undefined) Router.reload();
      } else {
        return err.response;
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const statusNumberRelease = async (number: string) => {
  const url = `${process.env.API_URL_MW}/releaseMsisdnEsim`;
  const payload = {
    msisdn: number,
  };

  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const header = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, payload, header);

      return response;
    } catch (err: any) {
      if (err.response.status == 403) {
        const token = await getToken();
        if (token !== undefined) {
          try {
            const header = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("refreshToken")}`,
              },
            };
            const response = await axios.post(url, payload, header);
            return response;
          } catch (err: any) {
            return err.response;
          }
        }
      } else {
        return err.response;
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) {
      try {
        const header = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("refreshToken")}`,
          },
        };
        const response = await axios.post(url, payload, header);
        return response;
      } catch (err: any) {
        return err.response;
      }
    }
  }
};

export const CreateOrderEsim = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineCreateOrderEsim`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, payload, header);
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const CreatePaymentEsim = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineVaEsim`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, payload, header);
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const CreatePaymentEsimEwallet = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineEwalletEsim`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, payload, header);
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const ListProductEsim = async (e = "all") => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getListPaket`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, { status: "esim" }, header);

      if (e == "all") {
        return response;
      } else {
        const data = response?.data?.result?.data;
        data.sort((a: any, b: any) => a.order - b.order);
        const filter = data.filter((item: any) => {
          return item?.initial_packet == e;
        });

        return filter;
      }
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const ListProductEsimId = async (e = "all") => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/getListPaket`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    try {
      const response = await axios.post(
        url,
        { status: "esim", uuid: uuidv4() },
        header
      );

      const data = response?.data?.result?.data;
      const filter = data.filter((item: any) => {
        return item?.serviceId == e;
      });

      return filter;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const ListPaymentEsim = async () => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getListPayment`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, { status: "esim" }, header);
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const encryptMsisdn = async (msisdn: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/encrypt`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const payload = {
        msisdn: msisdn,
      };
      const response = await axios.post(url, payload, header);
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};
