import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import StepList from "@components/global/steplist";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber, prependZero } from "@components/global/mixins";
import SEO from "@components/global/seo";
import { useQRCode } from "next-qrcode";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/router";
import { useCountdown } from "rooks";
import moment from "moment";
import { GetPaymentStatus } from "pages/api/igw";
import { Button } from "@components/templates/button/button";
import PendingPayment from "@components/global/modal/pending-payment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { statusNumberRelease } from "pages/api/esim";
import { addsPaymentnAction, addsPaymentnLand } from "src/data-layer/adds";
import { layerEventGA4Trx } from "src/data-layer";
import Trouble from "@components/global/modal/trouble";
import RateLimit from "@components/global/modal/rate-limit";
import { dataQRIS } from "@components/data";

const EwalletEsim = () => {
  const router = useRouter();
  const [nomorEsim, setNomorEsim] = useState<string>("");
  const [loadingPending, setLoadingPending] = useState<boolean>(false);
  const [openPending, setPending] = useState<boolean>(false);
  const [openRateLimit, setOpenRateLimit] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);
  const [toast, setToast] = useState<boolean>(false);
  const { SVG } = useQRCode();

  const { productESim, payload, payment, personal, uuid } = useSelector(
    (state: State) => ({
      productESim: state.product.productESim,
      payload: state.payload,
      payment: state.payment,
      personal: state.personal.personal,
      uuid: state.uuid.uuid,
    }),
    shallowEqual
  );

  const count = useCountdown(new Date(payment?.wallet?.expired), {
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
  }, [count, payment?.wallet?.expired]);

  useEffect(() => {
    const decryptedSelected = payload?.selected;
    const outputB =
      "0" + decryptedSelected?.substring(2, decryptedSelected.length);

    setNomorEsim(outputB);
  }, []);

  useEffect(() => {
    if (!payment?.trxid) {
      localStorage.removeItem("flashPurchase");
    } else {
      layerEventGA4Trx({
        transaction: payment.trxid,
        product: productESim,
        delivery: 0,
      });
      addsPaymentnLand();
    }
  }, []);

  useEffect(() => {
    if (
      duration.hours == "0 Jam" &&
      duration.minutes == "0 Menit" &&
      duration.seconds == "0 Detik"
    ) {
      // do cancel
      CancelReserveSync();
    }
  }, [duration]);

  const getStatusPayment = async (type: string = "interval") => {
    const response = await GetPaymentStatus(payment.trxid, payload.email, uuid);

    if (response?.status == 200) {
      if (response.data.result.data.paymentStatus === "SUCCESS") {
        router.push("/status/sukses");
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

  const CancelReserveSync = async () => {
    const response = await GetPaymentStatus(payment.trxid, payload.email, uuid);

    if (response?.status == 200) {
      if (response.data.result.data.paymentStatus === "SUCCESS") {
        router.push("/status/sukses");
      }
    } else {
      setOpenTrouble(true);
      setLoadingPending(false);
    }

    const release = await statusNumberRelease(payload?.selected_encrypt);

    if (release?.status == 200) {
      router.push("/pembayaran-esim/qris/timeout");
    } else if (release?.status == 429) {
      setLoadingPending(false);
      setOpenRateLimit(true);
    } else {
      setLoadingPending(false);
      setOpenTrouble(true);
    }
  };

  return (
    <div className="container">
      <SEO title={"Pembayaran eSIM E-Wallet ShopeePay"} />
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
              src="/esim/time.svg"
              width={100}
              height={100}
              className="mt-1"
              alt="Wait"
            />
          </div>
          <div className="text-center shadow-lg border border-t-gray-100 rounded-xl p-4 font-Museo mb-3">
            <div className="py2">
              <div className="flex flex-col items-center">
                <SVG
                  text={payment.wallet.qr_code ?? "-"}
                  options={{
                    margin: 2,
                    width: 200,
                    color: {
                      dark: "#000",
                      light: "#fff",
                    },
                  }}
                />
              </div>
            </div>
            <div className="py-5">
              <h3 className="text-md font-Museo-Bold">Menunggu Pembayaran</h3>
              <p className="text-sm">Batas Waktu Pembayaran</p>
              <p className="font-Museo-Bold">
                {duration.minutes} : {duration.seconds}
              </p>
            </div>
            <hr />
            <div className="list-info mt-5">
              <div className="list-label">Paket</div>
              <div className="list-value">
                {productESim.name} {productESim.kuota_full}, {productESim.day}
                {"hr"}
              </div>
            </div>
            <div className="list-info">
              <div className="list-label">Nomor eSIM</div>
              <div className="list-value">{nomorEsim}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Kode Transaksi</div>
              <div className="list-value">{payment.trxid}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Metode Pembayaran</div>
              <div className="list-value">QRIS</div>
            </div>
            <div className="list-info">
              <div className="list-label">Jumlah Tagihan</div>
              <div className="list-value">
                {priceNumber(
                  payload?.price +
                  productESim?.price +
                  (productESim?.msisdn_price ? productESim?.msisdn_price : 0)
                )}
              </div>
            </div>
            <hr />
            <div className="w-full m-auto ">
              <Button
                variant="axis"
                className="button-container mt-5"
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
          <div className="py-6 px-4 bg-light-blue flex flex-row items-center justify-center rounded-[12px] mb-8 mt-6">
            <div className="flex justify-between w-full">
              <div className="text-sm md:sm:text-md font-Museo pr-14">
                <h3 className="font-Museo-Bold text-sm md:sm:text-lg">
                  Cek Email untuk Aktivasi{" "}
                </h3>
                Setelah pembayaran berhasil, silakan cek email untuk mengetahui
                cara aktivasi & instalasi eSIM pada perangkat Anda.
              </div>
              <div className="">
                <Image
                  src="/esim/email_success.svg"
                  width={100}
                  height={100}
                  className=""
                  alt="Info"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="py-3">
            <h3 className="font-Museo-Bold">Cara bayar dengan QRIS </h3>
          </div>
          <StepList title={"Cara Bayar"}>
            {dataQRIS.map((item: any, index: number) => (
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
                Pastikan transaksi QRIS Anda sudah terverifikasi sebelum
                melakukan transaksi lain dengan metode pembayaran yang sama
              </div>
            </div>
          </div>
        </div>
      </div>
      <PendingPayment openPending={openPending} setPending={setPending} />
      <Trouble openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
      <RateLimit
        modalRateLimit={openRateLimit}
        setModalRateLimit={setOpenRateLimit}
      />
    </div>
  );
};

export default EwalletEsim;
