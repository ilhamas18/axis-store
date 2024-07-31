import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import Image from "next/image";
import StepList from "@components/global/steplist";
import ClipBoard from "@components/global/clipboard";
import { dataAtmCimbNiaga, dataMbCimbNiaga } from "@components/data";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber, prependZero } from "@components/global/mixins";
import { useCountdown } from "rooks";
import moment from "moment";
import { cancelReserve } from "pages/api/narindo";
import { GetPaymentStatus } from "pages/api/igw";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { Button } from "@components/templates/button/button";
import PendingPayment from "@components/global/modal/pending-payment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SEO from "@components/global/seo";
import { layerEventGA4Trx } from "src/data-layer";
import Script from "next/script";
import { addsPaymentnAction, addsPaymentnLand } from "src/data-layer/adds";
import Trouble from "@components/global/modal/trouble";
import RateLimit from "@components/global/modal/rate-limit";

const VirtualAccount = () => {
  const router = useRouter();
  const handleNext = () => { };
  const [openRateLimit, setOpenRateLimit] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);

  const { product, delivery, personal, payment, uuid } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      personal: state.personal.personal,
      payment: state.payment,
      uuid: state.uuid.uuid
    }),
    shallowEqual
  );

  const count = useCountdown(new Date(payment?.va?.expired), {
    interval: 1000,
  });

  const duration = useMemo(() => {
    const duration = moment.duration(count, "seconds");
    let dateNow = moment(moment.now()).format("YYYY-MM-DD HH:mm:ss");
    let compare;

    return {
      hours: prependZero(duration.hours(), 0) + " Jam",
      minutes: prependZero(duration.minutes(), 0) + " Menit",
      seconds: prependZero(duration.seconds(), 0) + " Detik",
    };
  }, [count, payment?.va?.expired]);

  const [toast, setToast] = useState<boolean>(false);
  const [openPending, setPending] = useState<boolean>(false);
  const [loadingPending, setLoadingPending] = useState<boolean>(false);

  const CancelReserveSync = async () => {
    const response = await GetPaymentStatus(payment.trxid, personal.email, uuid);

    if (response.status == 200) {
      if (response.data.result.data.paymentStatus === "SUCCESS") {
        router.push("/status/proses");
      }
    } else {
      setOpenTrouble(true);
    }

    const reserve: any = await cancelReserve(payment.reserved, payment.trxid, uuid);

    if (reserve.status == 200) {
      router.push("/pembayaran/virtual-account-cimb-niaga/timeout");
    } else if (reserve.status == 429) {
      setLoadingPending(false);
      setOpenRateLimit(true);
    } else {
      setLoadingPending(false);
      setOpenTrouble(true);
    }
  };

  const getStatusPayment = async (type: string = "interval") => {
    const response = await GetPaymentStatus(
      payment.trxid,
      personal.email,
      uuid
    );

    if (response.status == 200) {
      if (response.data.result.data.paymentStatus === "SUCCESS") {
        router.push("/status/proses");
      }
    } else {
      setLoadingPending(false);
      setOpenTrouble(true);
    }

    if (type != "interval") {
      setPending(true);
      setLoadingPending(false);
      if (
        duration.hours == "0 Jam" &&
        duration.minutes == "0 Menit" &&
        duration.seconds == "0 Detik"
      ) {
        localStorage.removeItem("flashPurchase");
        CancelReserveSync();
      }
    }
  };

  useEffect(() => {
    const time = setInterval(() => {
      getStatusPayment("interval");
    }, 60000);

    return () => {
      clearInterval(time);
    };
  }, [payment?.va?.expired]);

  useEffect(() => {
    if (
      duration.hours == "0 Jam" &&
      duration.minutes == "0 Menit" &&
      duration.seconds == "0 Detik"
    ) {
      // do cancel
      localStorage.removeItem("flashPurchase");
      CancelReserveSync();
    }
  }, [duration]);

  useEffect(() => {
    layerEventGA4Trx({ transaction: payment.trxid, product, delivery });
    addsPaymentnLand();
  }, []);

  return (
    <div className="container">
      <SEO title={"Pembayaran Virtual Account CIMB Niaga"} />
      <iframe
        src="https://9562726.fls.doubleclick.net/activityi;src=9562726;type=xlweb0;cat=dan_x004;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=[SessionID]?"
        width="1"
        height="1"
        frameBorder="0"
        style={{ display: "none" }}
      ></iframe>
      <Script type="text/javascript" strategy="lazyOnload">
        {`twq('event', 'tw-o48oj-odwd4', {})`}
      </Script>
      <PendingPayment openPending={openPending} setPending={setPending} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast}
        autoHideDuration={2000}
        onClose={() => {
          setToast(false);
        }}
      >
        <div className="bg-white font-Museo-Medium text-center shadow-xl text-lg mt-40 p-4 border border-gray-300 rounded-2xl">
          Status Sedang Menunggu Pembayaran
        </div>
      </Snackbar>
      <div className="body pb-6">
        <div className="px-4 border-b-2 border-light-gray">
          <div className="image flex align-middle justify-center py-5">
            <Image
              src="/icons/waiting.png"
              width={100}
              height={100}
              className="mt-1"
              alt="Wait"
            />
          </div>
          <div className="text-center shadow-card px-4 font-Museo">
            <div className="py-5">
              <h3 className="text-lg font-Museo-Bold">Menunggu Pembayaran</h3>
              <p className="text-sm">Batas Waktu Pembayaran</p>
              <p className="font-Museo-Bold">
                {duration.minutes} : {duration.seconds}
              </p>
            </div>
            <hr />
            <div className="list-info mt-5">
              <div className="list-label">Paket</div>
              <div className="list-value">
                {product.total_kuota == true ? (
                  <span>{product.name} {product.kuota_full}</span>
                ) : (
                  <span>{product.name} {product.kuota_utama}</span>
                )}
              </div>
            </div>
            <div className="list-info">
              <div className="list-label">Nomor Transaksi</div>
              <div className="list-value">{payment.trxid}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Metode Pembayaran</div>
              <div className="list-value">Virtual Account CIMB Niaga</div>
            </div>
            <div className="list-info">
              <div className="list-label">Pengiriman</div>
              <div className="list-value">
                {delivery?.courier?.name} {delivery?.courier?.group}
              </div>
            </div>
            <div className="list-info">
              <div className="list-label">Jumlah Tagihan</div>
              <div className="list-value">
                {priceNumber(product?.price + delivery?.courier?.price)}
              </div>
            </div>
            <hr />
            <div className="w-full m-auto ">
              <Button
                variant="axis"
                className="button-container mt-5 mb-5"
                rounded
                disabled={loadingPending}
                onClick={() => {
                  setLoadingPending(true);
                  getStatusPayment("check");
                  addsPaymentnAction();
                }}
              >
                <div className="flex justify-center items-center font-Museo-Medium">
                  {!loadingPending ? (
                    <span className="button-text">Cek status pembayaran</span>
                  ) : (
                    <span className="button-text flex items-center gap-2">
                      <span className="animate-spin">
                        <AiOutlineLoading3Quarters />{" "}
                      </span>{" "}
                      <span>Memeriksa</span>
                    </span>
                  )}
                </div>
              </Button>
            </div>
          </div>
          <div className="py-5">
            <h3 className="font-Museo-Bold">Transfer ke </h3>
            <div className="card-payment-info font-Museo md:text-md text-sm w-full flex items-center justify-between">
              <div className="content">
                <div className="image">
                  <Image
                    src="/icons/payments/cimb.png"
                    width={30}
                    height={30}
                    alt="BRI"
                  />
                </div>
                <div className="ml-5 text-md w-3/4">
                  <p className="font-Museo-Bold">{payment?.va?.va_number}</p>
                  <span className="text-sm">Virtual Account CIMB Niaga</span>
                </div>
              </div>
              <ClipBoard text={payment?.va?.va_number} />
            </div>
          </div>
          <div className="py-6 px-4 bg-light-blue flex flex-row items-center justify-center rounded-[12px] mb-8 mt-6">
            <div className="w-[10%]">
              <RiErrorWarningLine size={23} style={{ color: "#6F2B90" }} />
            </div>
            <div className="w-[90%]">
              <div className="font-Museo-Light tracking-wider text-sm">
                Semua pesanan yang masuk setelah jam 5 sore, akan di proses pada
                hari berikutnya.
              </div>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="py-3">
            <h3 className="font-Museo-Bold">Cara bayar via Virtual Account </h3>
          </div>
          <StepList title={"ATM"}>
            {dataAtmCimbNiaga.map((item: any, index: number) => (
              <div
                className="p-2 rounded-lg flex font-Museo text-sm items-center"
                key={index}
              >
                <div className="rounded-full text-center font-Museo">
                  {item.no}.
                </div>
                <div className="ml-2 font-Museo-Medium">{item.msg}</div>
              </div>
            ))}
          </StepList>
          <StepList title={"Mobile Banking"}>
            {dataMbCimbNiaga.map((item: any, index: number) => (
              <div
                className="p-2 rounded-lg flex font-Museo text-sm items-center"
                key={index}
              >
                <div className="rounded-full text-center font-Museo">
                  {item.no}.
                </div>
                <div className="ml-2 font-Museo-Medium">{item.msg}</div>
              </div>
            ))}
          </StepList>
          <div className="py-6 flex flex-row items-start justify-center rounded-[12px]">
            <div className="w-[10%]">
              <Image
                src="/icons/info.png"
                width={25}
                height={25}
                className="mt-1"
                alt="Info"
              />
            </div>
            <div className="w-[90%]">
              <div className="font-Museo md:text-sm tracking-wider text-xs text-slate-500">
                Pastikan transaksi CIMB Niaga Virtual Account Anda sudah terverifikasi
                sebelum melakukan transaksi lain dengan metode pembayaran yang
                sama
              </div>
            </div>
          </div>
        </div>
      </div>
      <Trouble openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
      <RateLimit
        modalRateLimit={openRateLimit}
        setModalRateLimit={setOpenRateLimit}
      />
    </div>
  );
};

export default VirtualAccount;
