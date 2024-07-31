import * as React from "react";
import { useState, useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
import Image from "next/image";
import Radio from "@mui/material/Radio";
import Total from "@components/global/total";
import {
  ListPayment,
  CreateOrder,
  CreatePayment,
  CreatePaymentEwallet,
} from "pages/api/igw";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import InvalidCaptcha from "@components/global/modal/invalid-captcha";
import Trouble from "@components/global/modal/trouble";
import Loading from "@components/global/loading";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  setPaymentAccount,
  setPaymentAccountWallet,
  setPaymentMethod,
  setReservedNumber,
  setTrxId,
} from "store/payment/action";
import { cancelReserve } from "pages/api/narindo";
import { checkDevice, } from "@components/global/mixins";
import { GetCurrentDate } from "pages/api/igw";
import SEO from "@components/global/seo";
import { filterSpecialCharacters } from "src/hooks/filterCharacter";
import { addsPembayaranLand, addsPembayaranAction } from "src/data-layer/adds";
import RateLimit from "@components/global/modal/rate-limit";
import useToast from "src/hooks/useToast";

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [payment, setPayment] = useState<string>("");
  const [listPayment, setListPayment] = useState<Array<String>>([]);
  const [openIC, setOpenIC] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const addToast: any = useToast();

  const { product, delivery, personal, paymentMethod, uuid } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      personal: state.personal.personal,
      paymentMethod: state.payment.method,
      uuid: state.uuid.uuid
    }),
    shallowEqual
  );

  const createOrderSync = async (paymentType: string) => {
    try {
      const CDT = await GetCurrentDate();
      let pickupTime = "";
      const weekday = [
        "minggu",
        "senin",
        "selasa",
        "rabu",
        "kamis",
        "jumat",
        "sabtu",
      ];
      let limit_time = "17:00";
      const current = new Date(CDT);
      const dnext = new Date(CDT);

      let day_current = weekday[current.getUTCDay()];
      let hour_current = current.getHours().toString();
      let minute_current = current.getMinutes().toString();

      let time_current =
        (hour_current.length > 1 ? hour_current : "0" + hour_current) +
        ":" +
        (minute_current.length > 1 ? minute_current : "0" + minute_current);

      const date_next = (next: any) => {
        let year = next.getFullYear().toString();
        let month = parseInt(next.getMonth() + 1, 10).toString();
        let date = next.getDate().toString();
        return (
          year +
          "-" +
          (month.length > 1 ? month : "0" + month) +
          "-" +
          (date.length > 1 ? date : "0" + date) +
          "T17:00:00.00"
        );
      };
      if (
        day_current == "senin" ||
        day_current == "selasa" ||
        day_current == "rabu" ||
        day_current == "kamis"
      ) {
        if (time_current >= limit_time) {
          dnext.setDate(dnext.getDate() + 1);
          pickupTime = date_next(dnext);
        } else {
          dnext.setDate(dnext.getDate());
          pickupTime = date_next(dnext);
        }
      }

      if (day_current == "jumat") {
        if (time_current >= limit_time) {
          dnext.setDate(dnext.getDate() + 3);
          pickupTime = date_next(dnext);
        } else {
          dnext.setDate(dnext.getDate());
          pickupTime = date_next(dnext);
        }
      }

      if (day_current == "sabtu") {
        dnext.setDate(dnext.getDate() + 2);
        pickupTime = date_next(dnext);
      }

      if (day_current == "minggu") {
        dnext.setDate(dnext.getDate() + 1);
        pickupTime = date_next(dnext);
      }

      const total = parseInt(product.price) + parseInt(delivery.courier.price);

      const payload: any = {
        uuid,
        captcharesponse: localStorage.getItem("handshake"),
        createOrderPayload: {
          amount: total,
          paymentDetails: [
            {
              paymentType: paymentType,
              amount: total,
            },
          ],
          items: [
            {
              id: product.serviceId,
              name: product.name,
              code: product.cmid,
              type: "SUBSCRIPTION_SP",
              price: product.price,
            },
            {
              id: "FEE_SP_NRD_" + delivery.courier.name + delivery.courier.code,
              name: product.name,
              code:
                "FEE_SP_NRD_" + delivery.courier.name + delivery.courier.code,
              type: "DELIVERY_FEE",
              price: delivery.courier.price,
            },
          ],
          contact: {
            name: filterSpecialCharacters(personal.name),
            email: filterSpecialCharacters(personal.email),
            phoneNumber: filterSpecialCharacters(personal.phone),
          },
          delivery: {
            courierCode: delivery.courier.name,
            serviceCode: delivery.courier.code,
            weight: 1000,
            amount: delivery.courier.price,
            useInsurance: false,
            shippingNotes: delivery.detail.info ?? "",
            usePickup: true,
            pickupTime: pickupTime,
            address: {
              province: delivery.province,
              cityType: delivery.cityType,
              city: delivery.city,
              district: delivery.district,
              village: delivery.subdistrict,
              postalCode: delivery.zipcode,
              addressDetail:
                delivery?.detail.info != "" &&
                  delivery?.detail?.info != undefined
                  ? delivery.detail.detail + " " + delivery?.detail?.info
                  : delivery.detail.detail,
            },
            item: {
              name: "Kartu Perdana - " + product.name,
              description: "Nomor XL axiata",
              category: "Dokumen",
              quantity: 1,
              amount: product.price,
              weight: 1000,
            },
          },
        },
        url: window.location.href.substring(0, 1000),
        utmChannel: router?.query?.utm_source ?? router?.query?.utm_channel,
        utmMedium: router?.query?.utm_medium,
        utmCampaign: router?.query?.utm_campaign,
      };

      const order = await CreateOrder(payload);
      return order;
    } catch (error: any) {
      return error.response
    }
  };

  const createPaymentSync = async (
    msisdn: string,
    paymentType: string,
    paymentCat: string = "BCA",
    trxid: string
  ) => {
    try {
      let pickupTime = "";
      const weekday = [
        "minggu",
        "senin",
        "selasa",
        "rabu",
        "kamis",
        "jumat",
        "sabtu",
      ];
      let limit_time = "17:00";
      // const CDT=await GetCurrentDate()
      const current = new Date();
      const date_current = (c: any) => {
        let a = new Date();
        let year = c.getFullYear().toString();
        let month = parseInt(c.getMonth() + 1, 10).toString();
        let date = c.getDate().toString();
        if (paymentMethod.type == "Virtual Account") {
          c.setMinutes(a.getMinutes() + 30);
        } else {
          c.setMinutes(a.getMinutes() + 5);
        }

        let hours = c.getHours().toString();
        let minutes = c.getMinutes().toString();
        let seconds = c.getSeconds().toString();

        return (
          (date.length > 1 ? date : "0" + date) +
          "-" +
          (month.length > 1 ? month : "0" + month) +
          "-" +
          year +
          " " +
          (hours.length > 1 ? hours : "0" + hours) +
          ":" +
          (minutes.length > 1 ? minutes : "0" + minutes) +
          ":" +
          (seconds.length > 1 ? seconds : "0" + seconds)
        );
      };

      let productName = '';
      {
        product.total_kuota == true ? (
          productName = product.name + " " + product.kuota_full
        ) : (
          productName = product.name + " " + product.kuota_utama
        )
      }

      const total = parseInt(product.price) + parseInt(delivery.courier.price);
      const payload: any = {
        msisdn: msisdn,
        payment_type: paymentType,
        transaction_id: trxid,
        emailCustomer: filterSpecialCharacters(personal.email),
        namaCustomer: filterSpecialCharacters(personal.name),
        productName: productName,
        deadline: date_current(current),
        bankName: paymentCat,
        totalPrice: total,
        itemName: productName,
        itemPrice: product.price,
        deliveryName: delivery.courier.name + " " + delivery.courier.group,
        deliveryPrice: delivery.courier.price,
        address: `${delivery.detail.detail}, ${delivery.subdistrict}, ${delivery.district
          },
            ${delivery.cityType} ${delivery.city}, ${delivery.province} ${delivery.zipcode
          } ${delivery.detail.info != "" &&
          delivery.detail.info != undefined &&
          "(" + delivery.detail.info + ")"
          }`,
      };
      console.log(payload, 'payload');


      const payload_ewallet: any = {
        transaction_id: trxid,
        type: paymentType,
        email: filterSpecialCharacters(personal.email),
        fullName: filterSpecialCharacters(personal.name),
        msisdn: msisdn,
        productName: "Kartu Perdana - " + productName,
        deadline: date_current(current),
        bankName: paymentCat,
        totalPrice: total,
        itemName: productName,
        itemPrice: product.price,
        deliveryName: delivery.courier.name + " " + delivery.courier.group,
        deliveryPrice: delivery.courier.price,
        address: `${delivery.detail.detail}, ${delivery.subdistrict}, ${delivery.district
          },
            ${delivery.cityType} ${delivery.city}, ${delivery.province} ${delivery.zipcode
          } ${delivery.detail.info != "" && delivery.detail.info != undefined
            ? "(" + delivery.detail.info + ")"
            : ""
          }`,
      };

      let payment: any = {};
      if (paymentMethod.type == "Virtual Account") {
        payment = await CreatePayment(payload);
      } else {
        payment = await CreatePaymentEwallet(payload_ewallet);
      }

      return payment;
    } catch (error: any) {
      return error.response;
    }
  };

  const CancelReserveSync = async (msisdn: string, trx: string) => {
    const result = await cancelReserve(msisdn, trx, uuid);
  };

  const handleTraker = () => {
    let dicount =
      typeof product.before_price !== "undefined" ? product.before_price : 0;
    let price = typeof product.price !== "undefined" ? product.price : 0;
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
            item_id: product.serviceId,
            item_name: `${product.name} ${product.kuota_full}`,
            affiliation: "AXIS",
            currency: "IDR",
            discount: dicountPrice,
            index: product.index,
            item_brand: "AXIS",
            item_category: `${product.name}`,
            item_category2: `${product.name} - ${product.type}`,
            item_list_id: "pilih_paket_kamu",
            item_list_name: "Pilih Paket Kamu",
            item_variant: product.kuota_full,
            price: dicount,
            quantity: 1,
          },
        ],
      },
    });
  };

  const handleNext = async () => {
    setLoadingButton(true);
    let d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    handleTraker();
    addsPembayaranAction();
    if (payment == "vabca") {
      const order = await createOrderSync("VABCA");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "VABCA",
          "BCA",
          order?.data?.result?.data?.data?.data.transactionId
        );

        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: payment?.data?.result?.data?.data?.accountNumber,
              expired: payment?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran/virtual-account-bca",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
        }
      }
      setLoadingButton(false);
    } else if (payment == "vabri") {
      const order = await createOrderSync("VABRI");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "VABRI",
          "BRI",
          order?.data?.result?.data?.data?.data.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: payment.data?.result?.data?.data.accountNumber,
              expired: payment?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran/virtual-account-bri",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
        }
      }
      setLoadingButton(false);
    } else if (payment === "vacimb") {
      const order = await createOrderSync("VACIMB");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "VACIMB",
          "CIMB",
          order?.data?.result?.data?.data?.data.transactionId
        );

        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: payment.data?.result?.data?.data.accountNumber,
              expired: payment?.data?.result?.data?.data?.expiredAt,
            })
          );
          router.push({
            pathname: "/pembayaran/virtual-account-cimb-niaga",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
        }
      }
      setLoadingButton(false);
    } else if (payment == "dana") {
      const order = await createOrderSync("XDANA");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "dana",
          "DANA",
          order?.data?.result?.data?.data?.data.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url_desktop: payment?.data?.result?.data?.data?.desktopWebCheckoutUrl,
              url_mobile: payment?.data?.result?.data?.data?.mobileWebCheckoutUrl,
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran/ewallet-dana",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
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
          order?.data?.result?.data?.msisdn,
          "shopeepay",
          "SHOPEEPAY",
          order?.data?.result?.data?.data?.data.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url: payment?.data?.result?.data?.data?.deeplinkCheckoutUrl,
              qr_string: payment?.data?.result?.data?.data?.qrCheckoutString,
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran/ewallet-shopeepay",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
        }
      }
      setLoadingButton(false);
    } else if (payment === "qris") {
      const order = await createOrderSync("XQRIS");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "qris",
          "QRIS",
          order?.data?.result?.data?.data?.data.transactionId,
        );

        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              qr_code: payment.data?.result?.data.data.qr,
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran/qris",
            query: {
              ...router.query,
            },
          });
        } else {
          CancelReserveSync(
            order?.data?.result?.data?.msisdn,
            order?.data?.result?.data?.data?.data.transactionId
          );
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
          setOpenTrouble(true);
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
  };

  const getListPayment = async () => {
    setLoading(true);
    const response = await ListPayment();

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
    setPayment(paymentMethod.code);
  }, []);

  return (
    <div className="container pb-8">
      <SEO title={"Pembayaran"} />
      <Loading loading={loading} setLoading={setLoading} />
      <InvalidCaptcha openIC={openIC} setOpenIC={setOpenIC} />
      <Trouble openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
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
            <p className="text-sm font-Museo-Bold">Bayar menggunakan</p>
          </div>
          <div className="px-4">
            {listPayment.filter((item: any) => {
              return item.type == "Virtual Account" && item.show == true;
            }).length > 0 && (
                <p className="font-Museo-Bold text-slate-500">Virtual Account</p>
              )}
            <div className="list-payment my-5 mb-10">
              {listPayment
                .filter((item: any) => {
                  return item.type == "Virtual Account" && item.show == true;
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
            <div className="list-payment my-5 mb-10">
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
          <Total>
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

export default Payment;
