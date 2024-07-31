import * as React from "react";
import { useState, useEffect } from "react";
import TextInput from "@components/templates/text-input/input";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
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
import { priceNumberEmail } from "@components/global/mixins";
import { GetCurrentDate } from "pages/api/igw";
import RateLimit from "@components/global/modal/rate-limit";
import { filterSpecialCharacters } from "src/hooks/filterCharacter";
import useToast from "src/hooks/useToast";

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [payment, setPayment] = useState<string>("");
  const [openIC, setOpenIC] = useState<boolean>(false);
  const [openTrouble, setOpenTrouble] = useState<boolean>(false);
  const [openTroubleMsisdn, setOpenTroubleMsisdn] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [nomor, setNomor] = useState<string>("");
  const [errorNomor, setErrorNomor] = useState<any>(false);
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

  useEffect(() => {
    setPayment(paymentMethod.code);
  }, [paymentMethod.code]);

  function tesNomorHP(phone: any) {
    if (!phone || (!/^08[1-9][0-9]{7,13}$/.test(phone) && !/^628[1-9][0-9]{7,13}$/.test(phone))) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (tesNomorHP(nomor) || nomor == "" || nomor?.length < 2) {
      setErrorNomor("");
    } else {
      if (nomor?.substring(0, 2) == "08" || nomor?.substring(0, 3) == "628") {
        setErrorNomor("Nomor belum lengkap");
      } else {
        setErrorNomor("Nomor harus diawali dengan 08xx atau 628xx");
      }
    }
  }, [nomor]);

  const paymentName = (text: any) => {
    if (text == "GoPay") {
      return text.replace("GoPay", "Gojek");
    } else {
      return text;
    }
  };

  const createOrderSync = async (paymentType: string) => {
    try {
      const CDT = await GetCurrentDate();
      let pickupTime = "";
      const weekday = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
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
          year + "-" + (month.length > 1 ? month : "0" + month) + "-" + (date.length > 1 ? date : "0" + date) + "T17:00:00.00"
        );
      };
      if (day_current == "senin" || day_current == "selasa" || day_current == "rabu" || day_current == "kamis") {
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
              code: "FEE_SP_NRD_" + delivery.courier.name + delivery.courier.code,
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
              addressDetail: delivery.detail.detail + " " + delivery.detail.info,
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
        if (paymentMethod.name == "OVO") {
          c.setMinutes(a.getMinutes() + 1);
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

      const payload_ewallet: any = {
        transaction_id: trxid,
        type: paymentType,
        email: personal.email,
        fullName: personal.name,
        msisdn: msisdn,
        productName: "Kartu Perdana - " + productName,
        deadline: date_current(current),
        bankName: paymentCat,
        payment_customer_id: nomor,
        totalPrice: total,
        itemName: productName,
        itemPrice: product.price,
        deliveryName: delivery.courier.name + " " + delivery.courier.group,
        deliveryPrice: delivery.courier.price,
        address: `${delivery.detail.detail}, ${delivery.subdistrict}, ${delivery.district},
                ${delivery.cityType} ${delivery.city}, ${delivery.province} ${delivery.zipcode} (${delivery.detail.info})`,
      };

      let payment = await CreatePaymentEwallet(payload_ewallet);

      return payment;
    } catch (error: any) {
      return error.response;
    }
  };

  const handleNext = async () => {
    setLoadingButton(true);
    if (payment == "gopay") {
      let d = new Date();
      d.setMinutes(d.getMinutes() + 5);
      const order = await createOrderSync("GOPAY");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "gopay",
          "GOPAY",
          order?.data?.result?.data?.data?.data.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url: payment?.data?.result?.data?.deeplinkurl,
              qr_code: payment?.data?.result?.data?.generatedQrCode,
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran/ewallet-gopay",
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
    } else if (payment == "ovo") {
      const order = await createOrderSync("XOVO");
      let d = new Date();
      d.setSeconds(d.getSeconds() + 45);

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          order?.data?.result?.data?.msisdn,
          "ovo",
          "OVO",
          order?.data?.result?.data?.data?.data.transactionId
        );

        dispatch(setTrxId(order?.data?.result?.data?.data?.data.transactionId));
        dispatch(setReservedNumber(order?.data?.result?.data?.msisdn));

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              expired: d,
            })
          );

          router.push({
            pathname: "/pembayaran/ewallet-ovo",
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
    }
  };

  const CancelReserveSync = async (msisdn: string, trx: string) => {
    try {
      const result = await cancelReserve(msisdn, trx, uuid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <Loading loading={loading} setLoading={setLoading} />
      <InvalidCaptcha openIC={openIC} setOpenIC={setOpenIC} />
      <Trouble openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />

      <div className="px-4 pb-4">
        <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6 pb-5 border-b-2 border-light-gray">
          Masukkan nomor yang teregister di {paymentName(paymentMethod.name)}
        </div>
      </div>
      <div className="px-4 pb-4">
        <TextInput
          type="tel"
          id="nomor"
          name="nomor"
          label={"Nomor HP di " + paymentName(paymentMethod.name)}
          errors={errorNomor}
          value={nomor}
          change={(e: any) => setNomor(e)}
          max={13}
        />
        <ul className="px-4 flex flex-col gap-2 leading-8 py-5 border-b-2 border-light-gray">
          <li className="flex justify-between">
            <span className="w-5">1.</span>
            <span className="w-full">
              Buka aplikasi <span>{paymentName(paymentMethod.name)}</span> dan
              cek notifikasi untuk menyelesaikan pembayaran
            </span>
          </li>
          <li className="flex justify-between">
            <span className="w-5">2.</span>
            <span className="w-full">
              Pastikan Anda melakukan pembayaran dalam waktu{" "}
              {payment == "ovo" ? <b>40 detik</b> : "5 menit"} untuk menghindari
              pembatalan otomatis
            </span>
          </li>
        </ul>
      </div>
      <div className="button px-4">
        <Button
          variant="axis"
          className="button-container mb-10 mt-3"
          rounded
          onClick={handleNext}
          disabled={nomor == "" || loadingButton ? true : false}
        >
          <div className="flex justify-center items-center font-Museo-Medium text-white">
            {!loadingButton ? (
              <span className="button-text">Lanjutkan</span>
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
      </div>

      <RateLimit
        modalRateLimit={modalRateLimit}
        setModalRateLimit={setModalRateLimit}
      />
    </div>
  )
}

export default Payment;