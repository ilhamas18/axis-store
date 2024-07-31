import axios from "axios";
import Router from "next/router";
import { getToken } from "./auth";
import { getCookie } from "cookies-next";

export const ListProduct = async (e = "all") => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getListPaket`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, {}, header);

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

export const ListPayment = async () => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getListPayment`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const resp = await axios.post(url, {}, header);
      return resp;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const CreateOrder = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineOrderApi`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response: any = await axios.post(url, payload, header);

      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const GetOrder = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineGetOrderApi`;
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

export const CreatePayment = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineVaApi`;
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

export const CreatePaymentEwallet = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/combineEwallet`;
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

export const GetVA = async (payload: any) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getVaPayment`;
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

export const CheckStock = async () => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const uuid = getCookie("refreshToken")
    try {
      const url = `${process.env.API_URL_MW}/checkStock`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };

      const response = await axios.post(
        url,
        { status: "0", uuid: uuid },
        header
      );
      return response;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const GetPaymentStatus = async (
  id: string,
  email: string,
  uuid: string
) => {
  const url = `${process.env.API_URL_MW}/getStatusOrder?transactionid=${id}&email=${email}`;

  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, { uuid: uuid }, header);

      return response;
    } catch (err: any) {
      if (err.response.status == 403) {
        const token = await getToken();

        if (token !== undefined) {
          try {
            const header = {
              headers: {
                Authorization: `Bearer ${getCookie("refreshToken")}`,
              },
            };
            const response = await axios.post(url, { uuid: uuid }, header);

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
            Authorization: `Bearer ${getCookie("refreshToken")}`,
          },
        };
        const response = await axios.post(url, { uuid: uuid }, header);
        return response;
      } catch (err: any) {
        return err.response;
      }
    }
  }
};

export const GetCurrentDate = async () => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/getCurrentDT`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      const response = await axios.post(url, {}, header);

      return response?.data?.result?.data?.current;
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};
