import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import Snackbar from "@mui/material/Snackbar";
import Total from "@components/global/total";
import SEO from "@components/global/seo";
import Link from "next/link";
import { IoReloadCircleOutline, IoReloadOutline } from "react-icons/io5";
import {
  addsDetailPesananLand,
  addsDetailPesananAction,
} from "src/data-layer/adds";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const ConfirmationEsim = () => {
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [nomorEsim, setNomorEsim] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [toast, setToast] = useState<boolean>(false);

  const { productESim, payload } = useSelector(
    (state: State) => ({
      productESim: state.product.productESim,
      payload: state.payload,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (localStorage.getItem("trace") == "") {
      location.reload();
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "AddToCart",
        product_name: `${productESim.name} - ${productESim.kuota_full}`,
        product_value: productESim.price,
      });
      check_ga();
    }

    const decryptedSelected = payload?.selected;
    const outputB =
      "0" + decryptedSelected?.substring(2, decryptedSelected.length);

    setNomorEsim(outputB);
  }, []);

  function check_ga() {
    if (document.readyState == "complete") {
      addsDetailPesananLand();
    } else {
      setTimeout(check_ga, 500);
    }
  }

  function onchange(value: any) {
    setToken(value);
    localStorage.setItem("handshake", value);
  }

  const handleReset = () => {
    try {
      window.grecaptcha.reset();
    } catch (error) {
      console.log(error);
      location.reload();
    }
  };

  const handleNext = async () => {
    if (token) {
      addsDetailPesananAction();
      router.push({
        pathname: "/pembayaran-esim",
        query: {
          ...router?.query,
          edit: false,
        },
      });
    } else {
      setToast(true);
    }
  };

  return (
    <div className="container pb-8">
      <SEO title={"Detail Pesanan Esim"} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast}
        autoHideDuration={2000}
        onClose={() => {
          setToast(false);
          handleReset();
        }}
      >
        <div className="bg-white text-biruxl shadow-xl text-lg mt-36 p-4 border border-gray-300 rounded-2xl">
          Mohon lakukan verifikasi captcha terlebih dahulu
        </div>
      </Snackbar>
      <div className="px-4">
        <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6 mb-4">
          Detail Pesanan
        </div>
        <div className="form flex flex-col space-y-2">
          <div className="detail-container flex flex-col p-4 gap-4 border border-solid border-[#e2e2e2] rounded-2xl font-Museo-Light">
            <div className="leading-3">
              <p className="text-xl">Paket yang dipilih</p>
              <p className="text-lg font-Museo-Bold">
                {productESim.total_kuota == true ? (
                  <>{productESim.name} {productESim.kuota_full}</>
                ) : (
                  <>{productESim.name} {productESim.kuota_utama}</>
                )}
              </p>
            </div>
          </div>
          <div className="detail-container flex flex-col p-4 gap-4 border border-solid border-[#e2e2e2] rounded-2xl font-Museo-Light">
            <div className="leading-3">
              <p className="text-xl">Nomor eSIM yang dipilih</p>
              <p className="text-lg font-Museo-Bold">{nomorEsim}</p>
            </div>
          </div>
          <div className="subtitle font-Museo-Bold md:text-lg text-base tracking-wider mt-6 -mb-4">
            Data Diri
          </div>
          <div className="detail-container flex flex-col p-4 gap-4 border border-solid border-[#e2e2e2] rounded-2xl font-Museo-Light ">
            <div className="leading-3">
              <p className="text-base">Nama</p>
              <p className="text-base font-Museo-Bold">{payload?.name}</p>
            </div>
            <div className="leading-3">
              <p className="text-base">No Telp</p>
              <p className="text-base font-Museo-Bold">{payload?.existing}</p>
            </div>
            <div className="leading-3">
              <p className="text-base">Email</p>
              <p className="text-base font-Museo-Bold">{payload?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <form>
          <div className="flex flex-row items-start text-sm my-4 text-slate-500">
            <Checkbox
              id="agreement"
              value="true"
              onChange={(event: any) => {
                if (event.target.checked) {
                  setSolved(true);
                } else {
                  setSolved(false);
                }
              }}
              sx={{
                color: "#999",
                "&.Mui-checked": {
                  color: "#6F2B90",
                },
              }}
            />
            <p>
              {" "}
              Dengan melanjutkan transaksi ini, Anda telah membaca dan
              menyetujui{" "}
              <Link
                href="https://www.axis.co.id/kebijakan-privasi"
                target={"_blank"}
              >
                <span className="text-biruxl font-Museo-Bold">
                  Kebijakan Privasi
                </span>
              </Link>{" "}
              dan{" "}
              <Link
                href="https://www.axis.co.id/syarat-ketentuan"
                target={"_blank"}
              >
                <span className="text-biruxl font-Museo-Bold">
                  Syarat & Ketentuan
                </span>
              </Link>{" "}
              yang berlaku untuk layanan ini.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="captcha">
              <ReCAPTCHA
                onChange={onchange}
                sitekey={process.env.GOOGLE_RECAPTCHA_KEY ?? ""}
                onExpired={() => {
                  setToken("");
                  handleReset();
                }}
              />
            </div>
            <button
              onClick={() => handleReset()}
              className="flex m-auto my-3 justify-center items-center gap-2 text-xs font-semibold"
            >
              <IoReloadOutline />{" "}
              <div>
                Muat ulang jika captcha tidak tampil <br /> untuk bisa klik
                "Lanjutkan"
              </div>
            </button>
          </div>
        </form>
      </div>
      <Total type="esim">
        <Button
          variant="axis"
          className="button-container"
          rounded
          disabled={!solved || !token ? true : false}
          onClick={handleNext}
        >
          <div className="flex justify-center items-center font-Museo-Medium ">
            <span className="button-text tracking-widest">LANJUT</span>
          </div>
        </Button>
      </Total>
    </div>
  );
};

export default ConfirmationEsim;
