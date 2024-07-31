import React, { useEffect, useState } from "react";
import Image from "next/image";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Pagination from "./pagination";
import { Button } from "../../../../templates/button/button";
import useScrollAnim from "../../../../../hooks/useScrollAnim";
import { setProductESim } from "store/product/action";
import { setPrice, setSelected, setSelectedEncrypt } from "store/payload/action";
import { State } from "store/reducer";
import ModalStatusReserved from "./modal/modal-status-reserved";
import { priceNumber } from "@components/global/mixins";
import { checkCategoryMsisdn, statusNumber } from "pages/api/esim";
import RateLimit from "@components/global/modal/rate-limit";
import Total from "@components/global/total";
import useToast from "src/hooks/useToast";

interface type {
  type: any;
  list: any;
  page: number;
  lengthPage: number;
  setPageHandler: any;
  setOnNextGetNumber: any;
  setWarning: any;
  isOnSearch: boolean;
  loading: boolean;
  changeNumber?: boolean;
  selected?: string;
  handleTrakerSubmit: () => void;
}

const NumberList = ({
  type,
  list,
  page,
  setPageHandler,
  lengthPage,
  setOnNextGetNumber,
  setWarning,
  isOnSearch,
  loading,
  changeNumber,
  selected,
  handleTrakerSubmit,
}: type) => {
  const [trigger, anim] = useScrollAnim();
  const router = useRouter();
  const dispatch = useDispatch();

  const { productESim } = useSelector(
    (state: State) => ({
      productESim: state.product.productESim,
    }),
    shallowEqual
  );

  const [selectedNumber, setSelectedNumber] = useState<any>("");
  const [selectedNumberEncrypt, setSelectedNumberEncrypt] = useState<any>("");
  const [msisdn, setMsisdn] = useState<string>("");
  const [priceEsim, setPriceEsim] = useState<number>(0);
  const [modalReserved, setModalReserved] = useState<boolean>(false);
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const [packageLoading, setPackageLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [bonuses, setBonuses] = useState<any>({
    price: "",
    total_kuota: "",
    monthly_bonus: "",
  });
  const addToast: any = useToast();

  const decryptMsisdn = (el: string) => {
    const decrypted = el;
    const output = "0" + decrypted?.substring(2, decrypted.length);
    return output;
  };

  const onSelect = async (data: any) => {
    setPackageLoading(true);
    setBonuses({
      price: "",
      total_kuota: "",
      monthly_bonus: "",
    });
    setSelectedNumber(data.msisdn);
    setSelectedNumberEncrypt(data.encrypt);
    const number = data.msisdn;
    const output = "0" + number?.substring(2, number.length);
    setMsisdn(output);
    if (data.type === "premium") {
      const response = await checkCategoryMsisdn(data.encrypt);

      if (response?.status == 200) {
        setBonuses({
          price: response.data.result.data.price,
          total_kuota: response.data.result.data.total_kuota,
          monthly_bonus: response.data.result.data.monthly_bonus,
        });

        const data = {
          id: productESim.id,
          serviceId: productESim.serviceId,
          name: productESim.name,
          price: productESim.price,
          msisdn_price: +response.data.result.data.price,
          kuota: productESim.kuota_utama,
          kuota_double: productESim.kuota_double,
          day: productESim.day,
          cmid: productESim.cdmanid,
          before_price: productESim.before_price,
          kuota_full: productESim.kuota_full,
        };
        setPriceEsim(response.data.result.data.price);
        dispatch(setProductESim(data));
        setPackageLoading(false);
      } else if (response?.status == 403) {
        addToast(
          "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
        )
        setTimeout(() => router.push("/"), 2500);
      } else {
        setWarning('Koneksi bermasalah. Silakan tunggu beberapa saat lagi');
      }
    } else {
      const data = {
        id: productESim.id,
        serviceId: productESim.serviceId,
        name: productESim.name,
        price: productESim.price,
        msisdn_price: 0,
        kuota: productESim.kuota_utama,
        kuota_double: productESim.kuota_double,
        day: productESim.day,
        cmid: productESim.cdmanid,
        before_price: productESim.before_price,
        kuota_full: productESim.kuota_full,
      };
      setPriceEsim(0);
      dispatch(setProductESim(data));
      setPackageLoading(false);
    }
  };

  const onNextPage = async () => {
    if (router?.query?.edit == "true") {
      setLoadingSubmit(true);
      const response = await statusNumber(selectedNumberEncrypt);

      if (response?.status == 200) {
        dispatch(setSelected(selectedNumber));
        dispatch(setSelectedEncrypt(selectedNumberEncrypt));
        dispatch(setPrice(priceEsim));
        router.push({
          pathname: "/registrasi-esim",
          query: {
            ...router?.query,
          },
        });
        setLoadingSubmit(false);
        handleTrakerSubmit();
      } else if (response?.status == 403) {
        addToast(
          "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
        )
        setTimeout(() => router.push("/"), 2500);
      } else if (response?.status == 429) {
        setLoadingSubmit(false);
        overLimit();
      } else {
        setLoadingSubmit(false);
        setModalReserved(true);
      }
    } else {
      setLoadingSubmit(true)
      const response = await statusNumber(selectedNumberEncrypt);

      if (response?.status == 200) {
        dispatch(setSelected(selectedNumber));
        dispatch(setSelectedEncrypt(selectedNumberEncrypt));
        dispatch(setPrice(priceEsim));
        router.push({
          pathname: "/registrasi-esim",
          query: {
            ...router?.query,
          },
        });
        setLoadingSubmit(false);
        handleTrakerSubmit();
      } else if (response?.status == 403) {
        addToast(
          "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
        )
        setTimeout(() => router.push("/"), 2500);
      } else if (response?.status == 429) {
        setLoadingSubmit(false);
        overLimit();
      } else {
        setLoadingSubmit(false);
        setModalReserved(true);
      }
    }
  };

  const overLimit = () => {
    // ACTIVE POP UP
    setModalRateLimit(true);
    // ACTIVE POP UP
  };

  const selectedESim = {
    msisdn: msisdn,
    price: priceEsim
  };

  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="list-number">
          <div className="grid grid-cols-2 gap-4 mt-10" ref={trigger}>
            {list?.map((item: any, i: number) => (
              <div
                className={`${selectedNumber == item.msisdn ? "border-2 border-green-success shadow-xl" : "border-2 border-light-gray"
                  } rounded-md font-Museo-Bold text-center mb-4 cursor-pointer ${anim(i + 1)}`}
                key={i}
                onClick={() => {
                  onSelect(item);
                }}
              >
                {item.type === "premium" ? (
                  <>
                    <div className={`py-1 bg-[#d7e169] rounded-t-sm text-center text-biruxl text-sm uppercase`}>
                      {selectedNumber === item.msisdn ? (
                        <div className="font-Museo-Bold">+ Bonus Kuota {bonuses.total_kuota}</div>
                      ) : (
                        <div className="font-Museo">+ Bonus Kuota</div>
                      )}
                    </div>
                    <div className={`flex flex-col items-center justify-center py-2 px-4 ${selectedNumber === item.msisdn ? 'py-2' : 'py-7'}`}>
                      <div className="font-Museo-Bold md:text-lg text-sm text-biruxl">{decryptMsisdn(item.msisdn)}</div>
                      <div
                        className={`text-biruxl ${selectedNumber === item.msisdn ? "block" : "hidden"
                          }`}
                      >
                        {packageLoading ? (
                          <img src="/loading.svg" className="w-10 -mb-8" />
                        ) : (
                          <div className="font-Museo md:text-lg text-sm text-deep-gray md:mt-2 mt-1">{priceNumber(bonuses.price)}</div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center py-4 px-4">
                      <div className="font-Museo-Bold md:text-lg text-sm text-biruxl">{decryptMsisdn(item.msisdn)}</div>
                      <div className="font-Museo md:text-lg text-sm text-deep-gray md:mt-2 mt-1">{priceNumber(0)}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 mb-4 bg-white">
          <Pagination
            list={list}
            page={page}
            lengthPage={lengthPage}
            setPage={setPageHandler}
            setOnNextGetNumber={setOnNextGetNumber}
            isOnSearch={isOnSearch}
          />
        </div>
        <div className="space-x-3 pb-4 px-4 -mx-4"></div>
        <Total type="esim" selectedESim={selectedESim}>
          <Button
            variant="axis"
            className="button-container"
            disabled={selectedNumber ? false : true}
            rounded
            loading={loading || loadingSubmit || packageLoading ? true : false}
            onClick={onNextPage}
          >
            <div className="flex justify-center items-center text-white font-bold py-2 px-4">
              {loading ? (
                <>
                  <Image src="/loading.svg" width={28} height={28} alt="Loading" />
                  <span className="ml-4">Loading</span>
                </>
              ) : (
                <span className="button-text tracking-widest">LANJUT</span>
              )}
            </div>
          </Button>
        </Total>
      </div>

      {modalReserved && <ModalStatusReserved modalReserved={modalReserved} setModalReserved={setModalReserved} />}

      {modalRateLimit && <RateLimit modalRateLimit={modalRateLimit} setModalRateLimit={setModalRateLimit} />}
    </>
  );
};

export default NumberList;
