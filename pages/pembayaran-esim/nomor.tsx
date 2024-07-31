import * as React from "react";
import { useState, useEffect } from "react";
import TextInput from "@components/templates/text-input/input";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
import RateLimit from "@components/global/modal/rate-limit";
import {
  CreateOrderEsim,
  CreatePaymentEsimEwallet
} from "pages/api/esim";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import InvalidCaptcha from "@components/global/modal/invalid-captcha";
import TroubleEsim from "@components/global/modal/trouble-esim";
import TroubleEsimMsisdn from "@components/global/modal/trouble-esim-msisdn";
import Loading from "@components/global/loading";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  setPaymentAccountWallet,
  setTrxId,
} from "store/payment/action";
import SEO from "@components/global/seo";
import Script from "next/script";
import useToast from "src/hooks/useToast";

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [payment, setPayment] = useState<string>("");
  const [listPayment, setListPayment] = useState<Array<String>>([]);
  const [openIC, setOpenIC] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);
  const [openTroubleMsisdn, setOpenTroubleMsisdn] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [nomor, setNomor] = useState<string>("");
  const [errorNomor, setErrorNomor] = useState<any>(false);
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
    const digits = input.slice(1);
    const output = "62" + digits;

    return output;
  }

  const createOrderSync = async (paymentType: string) => {
    try {
      const total = parseInt(productESim?.price ? productESim?.price : 0) + parseInt(payload?.price ? payload?.price : 0);
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
    } catch (error: any) {
      return error.response
    }
  };

  const createPaymentSync = async (
    paymentCat: string = "gopay",
    trxid: string
  ) => {
    try {
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

      let package_name: string = ''
      if (productESim.total_kuota == true) package_name = productESim.name + " " + productESim.kuota_full
      else package_name = productESim.name + " " + productESim.kuota_utama

      const total =
        parseInt(productESim?.price ? productESim?.price : 0) +
        parseInt(payload?.price ? payload?.price : 0);

      const payloadEwallet: any = {
        transaction_id: trxid,
        type: paymentCat,
        email: payload?.email,
        fullName: payload?.name,
        msisdn: payload?.selected_encrypt,
        packageName: package_name,
        payment_customer_id: nomor,
        packagePrice: productESim?.price,
        totalPrice: total,
        EsimPrice: Number(payload?.price)
      };

      const payment = await CreatePaymentEsimEwallet(payloadEwallet);

      return payment;
    } catch (error: any) {
      return error.response;
    }
  };

  const paymentName = (text: any) => {
    if (text == "GoPay") {
      return text.replace('GoPay', 'Gojek')
    } else {
      return text;
    }
  }

  useEffect(() => {
    setPayment(paymentMethod.code)
  }, [paymentMethod.code])


  function tesNomorHP(phone: any) {
    if (!phone || (!/^08[1-9][0-9]{7,13}$/.test(phone) && !/^628[1-9][0-9]{7,13}$/.test(phone))) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (tesNomorHP(nomor) || nomor == "" || nomor.length < 2) {
      setErrorNomor("");
    } else {
      if (nomor?.substring(0, 2) == "08" || nomor?.substring(0, 3) == "628") {
        setErrorNomor("Nomor belum lengkap");
      } else {
        setErrorNomor("Nomor harus diawali dengan 08xx atau 628xx");
      }
    }
  }, [nomor]);

  const handleNext = async () => {
    setLoadingButton(true);
    if (payment == "gopay") {
      const order = await createOrderSync("GOPAY");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          "gopay",
          order?.data?.result?.data?.transactionId
        );

        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        let d = new Date();
        d.setMinutes(d.getMinutes() + 5);

        if (payment?.status == 200) {
          dispatch(
            setPaymentAccountWallet({
              url: payment.data.result.data.deeplinkurl,
              qr_code: payment.data.result.data.generatedQrCode,
              expired: d
            })
          );

          router.push({
            pathname: "/pembayaran-esim/ewallet-gopay",
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
    } else if (payment == "ovo") {
      const order = await createOrderSync("XOVO");

      if (order?.status == 200) {
        const payment: any = await createPaymentSync(
          "ovo",
          order?.data?.result?.data?.transactionId
        );
        dispatch(setTrxId(order?.data?.result?.data?.transactionId));

        if (payment?.status == 200) {
          let d = new Date();
          d.setSeconds(d.getSeconds() + 32);

          dispatch(
            setPaymentAccountWallet({
              expired: d,
            })
          );
          router.push({
            pathname: "/pembayaran-esim/ewallet-ovo",
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
    }
  };

  return (
    <div className="container">
      <SEO title={"Pembayaran Esim Nomor E-Wallet" + paymentName(paymentMethod.name)} />
      <iframe
        src="https://9562726.fls.doubleclick.net/activityi;src=9562726;type=xlweb0;cat=dan_x002;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=[SessionID]?"
        width="1"
        height="1"
        frameBorder="0"
        style={{ display: "none" }}
      ></iframe>
      <Script type="text/javascript" strategy="lazyOnload">
        {`twq('event', 'tw-o48oj-odwd0', {})`}
      </Script>

      <Loading loading={loading} setLoading={setLoading} />
      <InvalidCaptcha openIC={openIC} setOpenIC={setOpenIC} />
      <TroubleEsim openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
      <TroubleEsimMsisdn openTrouble={openTroubleMsisdn} setOpenTrouble={setOpenTroubleMsisdn} />

      <div className="px-4 pb-4 ">
        <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6 pb-5 border-b-2 border-light-gray">
          Masukan nomor yang teregister di {paymentName(paymentMethod.name)}
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
              Buka aplikasi <span>{paymentName(paymentMethod.name)}</span> dan cek notifikasi untuk menyelesaikan
              pembayaran
            </span>
          </li>
          <li className="flex justify-between">
            <span className="w-5">2.</span>
            <span className="w-full">
              Pastikan Anda melakukan pembayaran dalam waktu {payment == "ovo" ? <b>30 detik</b> : "5 menit"} untuk
              menghindari pembatalan otomatis
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
  );
};

export default Payment;
