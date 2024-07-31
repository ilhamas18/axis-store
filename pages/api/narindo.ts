import axios from "axios";
import Router from 'next/router';
import { getToken } from "./auth";
import { getCookie } from "cookies-next";

const retries = 5;
export const getAddrProvince = async (uuid: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    try {
      const url = `${process.env.API_URL_MW}/province`;
      const header = {
        headers: {
          Authorization: `Bearer ${getCookie("refreshToken")}`,
        },
      };
      for (var i = 0; i < retries; i++) {
        const response = await axios.post(url, uuid, header);

        return response;
      }
    } catch (err: any) {
      return err.response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const getAddrCity = async (province: string, uuid: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/city`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    const data = {
      province: province,
      uuid: uuid
    };

    for (var i = 0; i < retries; i++) {
      try {
        const response = await axios.post(url, data, header);

        return response;
      } catch (err: any) {
        return err
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const getAddrDistrict = async (
  province: string,
  city: string,
  type: string,
  uuid: string
) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/district`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    const data = {
      province: province,
      city: city,
      city_type: type,
      uuid: uuid
    };
    for (var i = 0; i < retries; i++) {
      try {
        const response = await axios.post(url, data, header);

        return response;
      } catch (err: any) {
        return err.response;
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const getAddrSubDistrict = async (
  province: string,
  city: string,
  type: string,
  district: string,
  uuid: string
) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/village`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    const data = {
      province,
      city,
      city_type: type,
      district,
      uuid
    };

    for (var i = 0; i < retries; i++) {
      try {
        const response = await axios.post(url, data, header);

        return response;
      } catch (err: any) {
        return err.response;
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const getServiceRate = async (
  serviceId: string,
  rp: number,
  province: string,
  city: string,
  city_type: string,
  district: string,
  village: string,
  postal_code: string,
  address_detail: string,
  uuid: string
) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/serviceRate`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };

    const data = {
      serviceId,
      uuid,
      courier_code: "ALL",
      service_group: "ALL",
      origin_address: {
        country: "Indonesia",
        province: "DKI Jakarta",
        city_type: "Kota",
        city: "Jakarta Utara",
        district: "Kelapa Gading",
        village: "Kelapa Gading Timur",
        postal_code: "14240",
        address_detail: "Jl Boulevard Raya, Grha Boulevard no 12C",
      },
      destination_address: {
        country: "Indonesia",
        province: province,
        city_type: city_type,
        city: city,
        district: district,
        village: village,
        postal_code: postal_code,
        address_detail: address_detail,
      },
      weight_gr: 1000,
      value_rp: rp,
      use_insurance: false,
    };

    for (var i = 0; i < retries; i++) {
      try {
        const response = await axios.post(url, data, header);

        return response;
      } catch (err: any) {
        return err.response;
      }
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};

export const cancelReserve = async (msisdn: string, trxid: string, uuid: string) => {
  if (typeof getCookie("refreshToken") !== "undefined") {
    const url = `${process.env.API_URL_MW}/cancelReserve`;
    const header = {
      headers: {
        Authorization: `Bearer ${getCookie("refreshToken")}`,
      },
    };
    const data = {
      msisdn: msisdn,
      order_id: trxid,
    };

    const response = await axios.post(url, data, header);
    for (var i = 0; i < retries; i++) {
      return response;
    }
  } else {
    const token = await getToken();
    if (token !== undefined) Router.reload();
  }
};
