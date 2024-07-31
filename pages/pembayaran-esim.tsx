import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
import Image from "next/image";
import Radio from "@mui/material/Radio";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { filterSpecialCharacters } from "src/hooks/filterCharacter";
import Loading from "@components/global/loading";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  setPaymentAccount,
  setPaymentMethod,
  setPaymentAccountWallet,
  setReservedNumber,
  setTrxId,
} from "store/payment/action";
import Total from "@components/global/total";
import {
  CreateOrderEsim,
  CreatePaymentEsim,
  ListPaymentEsim,
  CreatePaymentEsimEwallet,
} from "./api/esim";
import TroubleEsim from "@components/global/modal/trouble-esim";
import InvalidCaptchaEsim from "@components/global/modal/invalid-captcha-esim";
import SEO from "@components/global/seo";
import TroubleEsimMsisdn from "@components/global/modal/trouble-esim-msisdn";
import { checkDevice } from "@components/global/mixins";
import { addsPembayaranLand, addsPembayaranAction } from "src/data-layer/adds";
import RateLimit from "@components/global/modal/rate-limit";
import useToast from "src/hooks/useToast";
import { cancelReserve } from "./api/narindo";

const PaymentEsim = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [payment, setPayment] = useState<string>("");
  const [listPayment, setListPayment] = useState<Array<String>>([]);
  const [openIC, setOpenIC] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);
  const [openTroubleMsisdn, setOpenTroubleMsisdn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const addToast: any = useToast();

  const { productESim, payload, paymentMethod, uuid } = useSelector(
    (state: State) => ({
      productESim: state.product.productESim,
      payload: state.payload,
      paymentMethod: state.payment.method,
      uuid: state.uuid.uuid
    }),
    shallowEqual
  );

  function convertPhoneNumber(input: any) {
    // Remove the leading "0" from the input string
    const digits = input.slice(1);

    // Prepend "62" to the remaining digits
    const output = "62" + digits;

    return output;
  }

  const createOrderSync = async (paymentType: string) => {
    const total =
      parseInt(productESim?.price ? productESim?.price : 0) +
      parseInt(payload?.price ? payload?.price : 0);
    const payloadData: any = {
      uuid,
      captcharesponse: localStorage.getItem("handshake"),
      amount: total,
      msisdn: payload?.selected_encrypt,
      paymentType: paymentType,
      productId: productESim.serviceId,
      productType: "SUBSCRIPTIONSP-ESIM",
      contact: {
        email: payload?.email,
        fullName: payload?.name,
        phone: convertPhoneNumber(payload?.existing),
      },
      eid: "",
      url: window.location.href.substring(0, 1000),
      utmChannel: router?.query?.utm_source ?? router?.query?.utm_channel,
      utmMedium: router?.query?.utm_medium,
      utmCampaign: router?.query?.utm_campaign,
    };
    const order = await CreateOrderEsim(payloadData);
    return order;
  };

  const createPaymentSync = async (
    paymentCat: string = "BCA",
    trxid: string
  ) => {
    const current = new Date();
    const date_current = (c: any) => {
      let year = c.getFullYear().toString();
      let month = parseInt(c.getMonth() + 1, 10).toString();
      let date = c.getDate().toString();
      return (
        (date.length > 1 ? date : "0" + date) +
        "-" +
        (month.length > 1 ? month : "0" + month) +
        "-" +
        year
      );
    };

    let productName = '';
    {
      productESim.total_kuota == true ? (
        productName = productESim.name + " " + productESim.kuota_full
      ) : (
        productName = productESim.name + " " + productESim.kuota_utama
      )
    }

    const total =
      parseInt(productESim?.price ? productESim?.price : 0) +
      parseInt(payload?.price ? payload?.price : 0);

    const payloadData: any = {
      transaction_id: trxid,
      email: filterSpecialCharacters(payload?.email),
      fullName: filterSpecialCharacters(payload?.name),
      msisdn: payload?.selected_encrypt,
      packageName: productName,
      packagePrice: productESim?.price,
      totalPrice: total,
      EsimPrice: Number(payload?.price),
      deadline: date_current(current),
      bankName: paymentCat,
    };

    const payloadEwallet: any = {
      transaction_id: trxid,
      type: paymentCat,
      email: filterSpecialCharacters(payload?.email),
      fullName: filterSpecialCharacters(payload?.name),
      msisdn: payload?.selected_encrypt,
      packageName: productName,
      packagePrice: productESim?.price,
      totalPrice: total,
      EsimPrice: Number(payload?.price),
    };

    let payment: any = {};
    if (paymentMethod.type == "Virtual Account") {
      payment = await CreatePaymentEsim(payloadData);
    } else {
      payment = await CreatePaymentEsimEwallet(payloadEwallet);
    }

    return payment;
  };

  const CancelReserveSync = async (msisdn: string, trx: string) => {
    const result = await cancelReserve(msisdn, trx, uuid);
  };


  const handleTraker = () => {
    let dicount =
      typeof productESim.before_price !== "undefined"
        ? productESim.before_price
        : 0;
    let price =
      typeof productESim.price !== "undefined" ? productESim.price : 0;
    let dicountPrice = dicount - price;
    if (dicount === 0) {
      dicountPrice = 0;
    }
    let dicountPriceItem = dicount - dicountPrice;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_payment_info",
      ecommerce: {
        currency: "IDR",
        value: dicountPriceItem,
        coupon: "None",
        payment_type: `${paymentMethod.name} ${paymentMethod.type}`,
        items: [
          {
            item_id: productESim.serviceId,
            item_name: `${productESim.name} ${productESim.kuota_full}`,
            affiliation: "AXIS",
            currency: "IDR",
            discount: dicountPrice,
            index: productESim.index,
            item_brand: "AXIS",
            item_category: `${productESim.name}`,
            item_category2: `${productESim.name} - ${productESim.type}`,
            item_list_id: "pilih_paket_kamu",
            item_list_name: "Pilih Paket Kamu",
            item_variant: productESim.kuota_full,
            price: dicount,
            quantity: 1,
          },
        ],
      },
    });
  };

  const handleNext = async () => {
    if (router.query.error == "true") {
      setOpenTrouble(true);
      return;
    }
    setLoadingButton(true);
    let d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    handleTraker();
    addsPembayaranAction();
    if (payment == "vabca") {
      const order = await createOrderSync("VABCA");

      if (order?.status == 200) {
        const paymentVa: any = await createPaymentSync(
          "BCA",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (paymentVa?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: paymentVa?.data?.result?.data?.data?.accountNumber,
              expired: paymentVa?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/virtual-account-bca",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order?.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else if (payment == "vabri") {
      const order = await createOrderSync("VABRI");

      if (order?.status == 200) {
        const paymentVa: any = await createPaymentSync(
          "BRI",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (paymentVa?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: paymentVa?.data?.result?.data?.data,
              expired: paymentVa?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/virtual-account-bri",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order?.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else if (payment === "vacimb") {
      const order = await createOrderSync("VACIMB");

      if (order?.status == 200) {
        const paymentVa: any = await createPaymentSync(
          "CIMB",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (paymentVa?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: paymentVa?.data?.result?.data?.data,
              expired: paymentVa?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/virtual-account-cimb-niaga",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else if (payment == "dana") {
      const order = await createOrderSync("XDANA");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          "dana",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url_desktop: payment.data?.result?.data.data.desktopWebCheckoutUrl,
              url_mobile: payment.data?.result?.data.data.mobileWebCheckoutUrl,
              expired: d,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/ewallet-dana",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else if (payment == "shopee") {
      let order;

      if (checkDevice() === "Browser") {
        order = await createOrderSync("XSHOPEEPAYQR");
      } else {
        order = await createOrderSync("XSHOPEEPAY");
      }

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          "shopeepay",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url: payment.data.result.data.data.deeplinkCheckoutUrl,
              qr_string: payment.data.result.data.data.qrCheckoutString,
              expired: d,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/ewallet-shopeepay",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else if (payment === "qris") {
      const order = await createOrderSync("XQRIS");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          "qris",
          order?.data?.result?.data?.transactionId,
        );

        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              qr_code: payment.data?.result?.data.data.qr,
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran-esim/qris",
            query: {
              ...router.query,
            },
          });
        } else {
          setOpenTrouble(true);
        }
      } else {
        if (order?.status == 400) {
          setOpenIC(true);
        } else if (order?.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (order?.status == 429) {
          setModalRateLimit(true);
        } else {
          if (order.data.code == "BE-MsisdnIsNotEsim") {
            setOpenTroubleMsisdn(true);
          } else {
            setOpenTrouble(true);
          }
        }
      }
      setLoadingButton(false);
    } else {
      router.push({
        pathname: "/pembayaran/nomor",
        query: {
          ...router.query,
        },
      });
    }
  }

  const getListPayment = async () => {
    setLoading(true);
    const response = await ListPaymentEsim();

    if (response?.status == 200) {
      setListPayment(response?.data.result.data);
      setError("");
      setLoading(false);
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
      setLoading(false);
    } else if (response?.status == 429) {
      setModalRateLimit(true);
      setError("Terlalu banyak permintaan, silakan coba lagi nanti");
      setLoading(false);
    } else {
      setError("Koneksi bermasalah. Silakan tunggu beberapa saat lagi");
      setLoading(false);
    }
  };

  useEffect(() => {
    getListPayment();
    addsPembayaranLand();
    const paytime = setInterval(() => {
      getListPayment();
    }, 180000);
    return () => {
      clearInterval(paytime);
    };
  }, []);

  return (
    <div className="container pb-8">
      <SEO title={"Pembayaran Esim"} />
      <Loading loading={loading} setLoading={setLoading} />
      <InvalidCaptchaEsim openIC={openIC} setOpenIC={setOpenIC} />
      <TroubleEsim openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
      <TroubleEsimMsisdn
        openTrouble={openTroubleMsisdn}
        setOpenTrouble={setOpenTroubleMsisdn}
      />
      {error !== "" ? (
        <div className="bg-[#F3CED9] h-[58px] text-center flex items-center justify-center font-Museo-Bold text-[#C40D42]">
          <RiErrorWarningLine size={20} className="mr-2" /> {error}
        </div>
      ) : (
        <>
          <div className="px-4 pb-4">
            <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6">
              Pembayaran
            </div>
            <p className="text-sm font-Museo-Bold">
              Bayar menggunakan
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
              {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"} {"\u00A0"}
            </p>
          </div>
          <div className="px-4 pb-4">
            {listPayment.filter((item: any) => {
              return item.type == "Virtual Account" && item.show == true;
            }).length > 0 && (
                <p className="font-Museo-Bold text-slate-500">Virtual Account</p>
              )}
            <div className="list-payment my-5 mb-10">
              {listPayment
                .filter((item: any) => {
                  return item.type === "Virtual Account";
                })
                .map((item: any, index: number) => (
                  <div className="card-payment relative" key={index}>
                    {item?.off && (
                      <div className="off-wrapper absolute z-10 bg-white opacity-50 top-0 left-0 right-0 bottom-0"></div>
                    )}
                    <div className="content flex justify-between">
                      <div className="flex">
                        <div className="image">
                          <Image
                            src={item.image}
                            width={30}
                            height={30}
                            alt={item.name}
                          />
                        </div>
                        <div className="flex flex-col ml-4 text-md w-4/5">
                          <div className="font-Museo-Bold">{item.name}</div>

                          {item?.off && (
                            <div className="text-sm font-Museo">
                              Metode ini tidak bisa digunakan pada jam <br />
                              {item.end} - {item.start}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="checkbox">
                        <Radio
                          id="payment"
                          value={item.code}
                          checked={payment == item.code ? true : false}
                          onChange={(event: any) => {
                            if (event.target.checked) {
                              setPayment(event.target.value);
                              dispatch(
                                setPaymentMethod({
                                  name: item?.name,
                                  type: item?.type,
                                  code: item?.code,
                                })
                              );
                            } else {
                              setPayment("");
                            }
                          }}
                          sx={{
                            color: "#999",
                            "&.Mui-checked": {
                              color: "#6E2C91",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {listPayment.filter((item: any) => {
              return item.type == "Ewallet" && item.show == true;
            }).length > 0 && (
                <p className="font-Museo-Bold text-slate-500">E-Wallet</p>
              )}
            <div className="list-payment my-5">
              {listPayment
                .filter((item: any) => {
                  return item.type == "Ewallet" && item.show == true;
                })
                .map((item: any, index: number) => (
                  <div className="card-payment relative" key={index}>
                    {item?.off && (
                      <div className="off-wrapper absolute z-10 bg-white opacity-50 top-0 left-0 right-0 bottom-0"></div>
                    )}
                    <div className="content flex justify-between">
                      <div className="flex">
                        <div className="image">
                          <Image
                            src={item.image}
                            width={30}
                            height={30}
                            alt={item.name}
                          />
                        </div>
                        <div className="flex flex-col ml-4 text-md w-4/5">
                          <div className="font-Museo-Bold">{item.name}</div>

                          {item?.off && (
                            <div className="text-sm font-Museo">
                              Metode ini tidak bisa digunakan pada jam <br />
                              {item.end} - {item.start}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="checkbox">
                        <Radio
                          id="payment"
                          value={item.code}
                          checked={payment == item.code ? true : false}
                          onChange={(event: any) => {
                            if (event.target.checked) {
                              setPayment(event.target.value);
                              dispatch(
                                setPaymentMethod({
                                  name: item?.name,
                                  type: item?.type,
                                  code: item?.code,
                                })
                              );
                            } else {
                              setPayment("");
                            }
                          }}
                          sx={{
                            color: "#999",
                            "&.Mui-checked": {
                              color: "#6E2C91",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {listPayment.filter((item: any) => {
              return item.type == "QRIS" && item.show == true;
            }).length > 0 && (
                <p className="font-Museo-Bold text-slate-500">QRIS</p>
              )}
            <div className="list-payment my-5 mb-10">
              {listPayment
                .filter((item: any) => {
                  return item.type == "QRIS" && item.show == true;
                })
                .map((item: any, index: number) => (
                  <div className="card-payment relative" key={index}>
                    {item?.off && (
                      <div className="off-wrapper absolute z-10 bg-white opacity-50 top-0 left-0 right-0 bottom-0"></div>
                    )}
                    <div className="content flex justify-between">
                      <div className="flex">
                        <div className="image">
                          <Image
                            src={item.image}
                            width={30}
                            height={30}
                            alt={item.name}
                          />
                        </div>
                        <div className="flex flex-col ml-4 text-sm w-4/5">
                          <div className="font-Axiata-Bold">{item.name}</div>

                          {item?.off && (
                            <div className="text-sm font-Axiata-Book">
                              Metode ini tidak bisa digunakan pada jam <br />
                              {item.end} - {item.start}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="checkbox">
                        <Radio
                          id="payment"
                          value={item.code}
                          checked={payment == item.code}
                          onChange={(event: any) => {
                            if (event.target.checked) {
                              setPayment(event.target.value);
                              dispatch(
                                setPaymentMethod({
                                  name: item?.name,
                                  type: item?.type,
                                  code: item?.code,
                                })
                              );
                            } else {
                              setPayment("");
                            }
                          }}
                          sx={{
                            color: "#999",
                            "&.Mui-checked": {
                              color: "#6E2C91",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
          <Total type="esim">
            <Button
              variant="axis"
              className="button-container"
              rounded
              onClick={handleNext}
              disabled={payment == "" || loadingButton ? true : false}
            >
              <div className="flex justify-center items-center font-Museo-Medium text-white">
                {!loadingButton ? (
                  <span className="button-text tracking-widest">LANJUT</span>
                ) : (
                  <span className="button-text flex items-center gap-2 text-biruxl">
                    <span className="animate-spin">
                      <AiOutlineLoading3Quarters />{" "}
                    </span>{" "}
                    <span>Mohon Tunggu</span>
                  </span>
                )}
              </div>
            </Button>
          </Total>
        </>
      )}

      <RateLimit
        modalRateLimit={modalRateLimit}
        setModalRateLimit={setModalRateLimit}
      />
    </div>
  );
};


export default PaymentEsim;
