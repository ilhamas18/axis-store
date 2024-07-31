import * as React from "react";
import { useState, useEffect, useRef } from "react";
import TextInput from "@components/templates/text-input/input";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import { useRouter } from "next/router";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import axios from "axios";
import Total from "@components/global/total";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import SEO from "@components/global/seo";
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

const Confirmation = () => {
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [toast, setToast] = useState<boolean>(false);

  const { product, delivery, personal } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      personal: state.personal.personal,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (localStorage.getItem("trace") != "") {
      localStorage.setItem("trace", "");
      location.reload();
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "AddToCart",
        product_name: `${product.name} - ${product.kuota_full}`,
        product_value: product.price,
      });
      check_ga();
    }
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
        pathname: "/pembayaran",
        query: {
          ...router?.query,
        },
      });
    } else {
      setToast(true);
    }
  };

  const handleEdit = (pathname: string) => {
    localStorage.setItem(pathname, "true");
    router.push(pathname);
  };
  return (
    <div className="container pb-8">
      <SEO title={"Detail Pesanan"} />
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
              <p className="text-xl">Pesanan</p>
              <p className="text-lg font-Museo-Bold">
                {product.total_kuota == true ? (
                  <span>{product.name} {product.kuota_full}</span>
                ) : (
                  <span>{product.name} {product.kuota_utama}</span>
                )}
              </p>
            </div>
            <div className="leading-3">
              <p className="text-xl">Harga</p>
              <p className="text-lg font-Museo-Bold">
                {priceNumber(product.price)}
              </p>
            </div>
            <div className="link-edit text-slate-400 text-sm">
              Ingin mengganti produk lain?{" "}
              <button onClick={() => handleEdit("/pilih")}>
                <span className="font-Museo-Bold text-biruxl ">
                  Ganti Disini
                </span>
              </button>
            </div>
          </div>
          <div className="subtitle font-Museo-Bold md:text-lg text-base tracking-wider mt-6 -mb-4">
            Pengiriman
          </div>
          <div className="detail-container flex flex-col p-4 gap-4 border border-solid border-[#e2e2e2] rounded-2xl font-Museo-Light">
            <div className="leading-3">
              <p className="text-lg">Ekspedisi</p>
              <p className="text-base font-Museo-Bold">
                {delivery?.courier?.name} - {delivery?.courier?.price}
              </p>
              <p className="text-base">
                {delivery?.courier?.est?.replace("days", "hari pengiriman")}
              </p>
            </div>
            <div className="leading-4">
              <p className="text-lg">Alamat Anda</p>
              <p className="text-base font-Museo-Bold">
                {delivery.subdistrict}, {delivery.district},{" "}
                {delivery.cityType} {delivery.city}, {delivery.province}
              </p>
              <p className="text-sm">
                {delivery.detail.detail} {delivery.detail.info}
              </p>
            </div>
            <div className="leading-3">
              <p className="text-lg">Kode Pos</p>
              <p className="text-base font-Museo-Bold">{delivery.zipcode}</p>
            </div>
            <div className="link-edit text-slate-400 text-sm">
              Ingin mengganti alamat?{" "}
              <button onClick={() => handleEdit("/layanan-pengiriman")}>
                <span className="font-Museo-Bold text-biruxl ">
                  Ganti Disini
                </span>
              </button>
            </div>
          </div>
          <div className="subtitle font-Museo-Bold md:text-lg text-base tracking-wider mt-6 -mb-4">
            Data Diri
          </div>
          <div className="detail-container flex flex-col p-4 gap-4 border border-solid border-[#e2e2e2] rounded-2xl font-Museo-Light ">
            <div className="leading-3">
              <p className="text-base">Nama</p>
              <p className="text-base font-Museo-Bold">{personal?.name}</p>
            </div>
            <div className="leading-3">
              <p className="text-base">No Telp</p>
              <p className="text-base font-Museo-Bold">{personal?.phone}</p>
            </div>
            <div className="leading-3">
              <p className="text-base">Email</p>
              <p className="text-base font-Museo-Bold">{personal?.email}</p>
            </div>
            <div className="link-edit text-slate-400 text-sm">
              Ingin mengganti data diri anda?{" "}
              <button onClick={() => handleEdit("/registrasi")}>
                <span className="font-Museo-Bold text-biruxl ">
                  Ganti Disini
                </span>
              </button>
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
              menyetujui
              <Link
                href="https://www.axis.co.id/kebijakan-privasi"
                legacyBehavior
              >
                <a className="text-biruxl font-bold" target="_blank">
                  {" "}
                  Kebijakan Privasi
                </a>
              </Link>{" "}
              dan{" "}
              <Link
                href="https://www.axis.co.id/syarat-ketentuan"
                legacyBehavior
              >
                <a className="text-biruxl font-bold" target="_blank">
                  {" "}
                  Syarat & Ketentuan
                </a>
              </Link>{" "}
              yang berlaku untuk layanan ini
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
      <Total>
        <Button
          variant="axis"
          className="button-container"
          rounded
          disabled={!solved || !token ? true : false}
          onClick={handleNext}
        >
          <div className="flex justify-center items-center font-Museo-Medium">
            <span className="button-text tracking-widest">LANJUT</span>
          </div>
        </Button>
      </Total>
    </div>
  );
};

export default Confirmation;
function elseif(arg0: boolean) {
  throw new Error("Function not implemented.");
}
