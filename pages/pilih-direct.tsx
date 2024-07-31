import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "@components/global/seo";
import { useDispatch } from "react-redux";
import { ListProduct } from "pages/api/igw";
import { ListProductEsim } from "pages/api/esim";
import {
  setAddrProvince,
  setAddrCity,
  setAddrCityType,
  setAddrDistrict,
  setAddrSubDistrict,
  setAddrZipCode,
  setAddrDetailInfo,
  setCourier,
} from "store/delivery/action";
import { setPersonal } from "store/personal/action";
import {
  setPaymentMethod,
  setPaymentAccount,
  setReservedNumber,
  setTrxId,
  setPaymentAccountWallet,
} from "store/payment/action";
import { setProduct, setProductESim } from "store/product/action";
import {
  setChangeNumber,
  setEmail,
  setExisting,
  setName,
  setPrice,
  setSelected,
  setSelectedEncrypt,
  setTnCToken,
} from "store/payload/action";
import { v4 as uuidv4 } from "uuid";

const Pilih = () => {
  const router = useRouter();
  const uuid = uuidv4();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPaymentMethod({}));
    dispatch(setPaymentAccount({}));
    dispatch(setReservedNumber(""));
    dispatch(setTrxId(""));
    dispatch(setPaymentAccountWallet([]));
    dispatch(setAddrProvince(""));
    dispatch(setAddrCity(""));
    dispatch(setAddrCityType(""));
    dispatch(setAddrDistrict(""));
    dispatch(setAddrSubDistrict(""));
    dispatch(setAddrZipCode(""));
    dispatch(setAddrDetailInfo(""));
    dispatch(setPersonal({ name: "", email: "", phone: "" }));
    dispatch(
      setProduct({
        id: "",
        serviceId: "",
        name: "",
        price: "",
        kuota: "",
        kuota_double: "",
        day: "",
        cmid: "",
        category: "",
        before_price: "",
        kuota_full: "",
        url: "",
      })
    );
    dispatch(
      setProductESim({
        id: "",
        serviceId: "",
        name: "",
        price: "",
        kuota: "",
        kuota_double: "",
        day: "",
        cmid: "",
        before_price: "",
        kuota_full: "",
      })
    );
    dispatch(setChangeNumber(false));
    dispatch(setSelected([]));
    dispatch(setSelectedEncrypt([]));
    dispatch(setExisting([]));
    dispatch(setName([]));
    dispatch(setEmail([]));
    dispatch(setPrice([]));
    dispatch(setChangeNumber(false));
    dispatch(setTnCToken(""));
    dispatch(setCourier({}));
  }, [dispatch]);

  const getSelectProduct = async (paket: any) => {
    if (paket) {
      try {
        const response = await ListProduct(paket);

        const data = {
          serviceId: response[0]?.serviceId,
          name: response[0]?.name,
          price: response[0]?.price,
          before_price: response[0]?.before_price,
          kuota_double: response[0]?.kuota_double,
          day: response[0]?.day,
          cmid: response[0]?.cdmanid,
          kuota_utama: response[0]?.kuota_utama,
          kuota_full: response[0]?.kuota_full,
          total_kuota: response[0]?.total_kuota,
          length,
          type: response[0]?.type,
        };

        dispatch(setProduct(data));
        router.push({
          pathname: "/layanan-pengiriman",
          query: {
            ...router?.query,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getSelectProductEsim = async (paket: any) => {
    if (paket) {
      try {
        const response = await ListProductEsim(paket);

        const data = {
          serviceId: response[0]?.serviceId,
          name: response[0]?.name,
          price: response[0]?.price,
          before_price: response[0]?.before_price,
          kuota_double: response[0]?.kuota_double,
          day: response[0]?.day,
          cmid: response[0]?.cdmanid,
          kuota_utama: response[0]?.kuota_utama,
          kuota_full: response[0]?.kuota_full,
          total_kuota: response[0]?.total_kuota,
          length,
          type: response[0]?.type,
        };

        dispatch(setProductESim(data));

        router.push({
          pathname: "/pilih-esim",
          query: {
            ...router?.query,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      let paket = router?.query?.paket ?? "";
      if (paket?.includes("esim") == true) {
        getSelectProductEsim(paket);
      } else {
        getSelectProduct(paket);
      }
    }
  }, [router.isReady]);

  return (
    <div className="pilih-container">
      <SEO title={"Pilih"} />

      <div className="flex flex-col space-y-2 text-left p-4 justify-center min-h-[50vh]">
        <div className="text-center shadow rounded-lg p-5">
          <h1 className="font-Museo-Bold">Mohon Tunggu</h1>
          <p>sedang memproses paket anda</p>
          <div className="font-Museo-Bold animate-pulse bg-slate-300 min-h-[20px] w-full rounded-lg my-4"></div>
        </div>

      </div>
    </div>
  );
};

export default Pilih;
