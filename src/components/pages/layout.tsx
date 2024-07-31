import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import Header from "@components/global/header/header";
import Footer from "@components/global/footer/footer";
import StepNumber from "@components/global/step-page/steps";
import { setPageStep } from "store/step-page/action";
import { IoIosArrowBack } from "react-icons/io";
import FloatingChat from "@components/global/script/chatbot";
import ModalbackRegister from "./registrasi-esim/modal/modal-back";
import LayananPengirimanNotif from "@components/pages/layanan-pengiriman/notification";
import { getToken } from "pages/api/auth";
import { getCookie } from "cookies-next";

declare global {
  interface JQueryStatic {
    getCss: any; // Declare the custom method
  }
}

const Layout = ({ children }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [wording, setWording] = useState<string>("");
  const [redirectTo, setRedirectTo] = useState<string>("");
  const [skipline, setSkipline] = useState<boolean>(false);
  const [modalValidateRegister, setModalValidateRegister] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { product, productESim, delivery, personal, payload } = useSelector(
    (state: State) => ({
      product: state.product.product,
      productESim: state.product.productESim,
      delivery: state.delivery,
      personal: state.personal.personal,
      payload: state.payload,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (
      router.pathname != "/detail-pesanan" &&
      router.pathname != "/cek-status"
    ) {
      localStorage.setItem("trace", Math.random().toString());
    }

    switch (router.pathname) {
      case "/pilih":
        dispatch(setPageStep(1));
        setWording("Kembali ke halaman utama");
        setRedirectTo("/");
        break;
      case "/layanan-pengiriman":
        if (!product?.name || product.serviceId == "0") {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(2));
        setWording("Kembali ke halaman pilih paket");
        setRedirectTo("/pilih");
        break;
      case "/registrasi":
        if (!product.name || !delivery?.province || product.serviceId == "0") {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(3));
        setWording("Kembali ke halaman pengiriman");
        setRedirectTo("/layanan-pengiriman");
        break;
      case "/detail-pesanan":
        if (
          !product.name ||
          !delivery?.province ||
          !personal?.name ||
          product.serviceId == "0"
        ) {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(4));
        setWording("Kembali ke halaman pengiriman");
        setRedirectTo("/layanan-pengiriman");
        break;
      case "/pembayaran":
        if (
          !product.name ||
          !delivery?.province ||
          !personal?.name ||
          product.serviceId == "0"
        ) {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(5));
        setWording("Kembali ke halaman detail pesanan");
        setRedirectTo("/detail-pesanan");
        break;
      case "/cek-status":
        dispatch(setPageStep(0));
        setWording("Kembali ke halaman utama");
        setRedirectTo("/");
        setSkipline(true);
        break;
      // ESIM
      case "/pilih-esim":
        if (!productESim?.name) {
          router.push({
            pathname: "/",
          });
        }
        if (!router.query.msisdn) {
          dispatch(setPageStep(2));
          setWording("Kembali ke halaman pilih paket");
          setRedirectTo("/pilih");
        } else {
          dispatch(setPageStep(2));
          setWording("Kembali");
        }
        break;
      case "/registrasi-esim":
        if (!productESim?.name || !payload?.selected) {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(3));
        setWording("Kembali ke halaman pilih nomor");
        setRedirectTo("/pilih-esim");
        break;
      case "/detail-pesanan-esim":
        if (
          !productESim?.name ||
          !payload?.selected ||
          !payload?.existing ||
          !payload?.name ||
          !payload?.email
        ) {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(4));
        setWording("Kembali ke halaman data diri");
        setRedirectTo("/registrasi-esim");
        break;
      case "/pembayaran-esim":
        if (
          !productESim?.name ||
          !payload?.selected ||
          !payload?.existing ||
          !payload?.name ||
          !payload?.email
        ) {
          router.push({
            pathname: "/",
          });
        }
        dispatch(setPageStep(5));
        localStorage.removeItem("flashPurchase");
        setWording("Kembali ke halaman detail pesanan");
        setRedirectTo("/detail-pesanan-esim");
        break;
      case "/pembayaran-esim/virtual-account-bca":
        if (
          !productESim?.name ||
          !payload?.selected ||
          !payload?.existing ||
          !payload?.name ||
          !payload?.email
        ) {
          router.push({
            pathname: "/",
          });
          localStorage.removeItem("flashPurchase");
        }
        dispatch(setPageStep(6));
        setWording("");
        break;
      // ESIM
      default:
        dispatch(setPageStep(0));
    }
  }, [router]);

  useEffect(() => {
    getAuthToken();
  }, []);

  const getAuthToken = async () => {
    setIsLoading(true);
    if (typeof getCookie("refreshToken") === "undefined") {
      const token = await getToken();
    } else {
      setInterval(
        async () => {
          await getToken();
        },
        1000 * 60 * 50
      );
    }
  };

  const handleBackToHome = () => {
    if (router.pathname == "/pilih") {
      router.push({
        pathname: redirectTo,
      });
    } else {
      if (redirectTo == "/pilih-esim") {
        if (!router.query.msisdn) {
          setModalValidateRegister(true);
        }
      } else {
        if (router.query.msisdn != null) {
          router.reload();
        } else {
          router.push({
            pathname: redirectTo,
          });
        }
      }
    }
  };

  const handleTitle = () => {
    if (router.pathname == "/") return "Home";

    let url = router.pathname;
    url = url.replace("/", "");
    url = url.replaceAll("/", " ");
    url = url.replaceAll("-", " ");

    const arr = url.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    url = arr.join(" ");
    return url;
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="flex justify-between bg-white sticky top-0 z-50 w-full py-4 xl:px-[8em] lg:px-[6em] md:px-[4em] px-4 shadow-md">
          <div></div>
          <div>
            {router.pathname == "/" ? (
              <div onClick={() => router.reload()}>
                <Header />
              </div>
            ) : (
              <Link href={"/"}>
                <Header />
              </Link>
            )}
          </div>
        </div>
        <div
          className={`grow bg-white min-h-screen ${router.pathname == "/"
            ? "min-w-full"
            : "md:max-w-xl md:min-w-[50vw] min-w-full  m-auto"
            } `}
        >
          {router.pathname !== "/" ? (
            <div className="pb-8">
              <div className="px-4 pt-3">
                <StepNumber />
              </div>
              {wording && (
                <div
                  className={`back mt-5 ${skipline == false ? "border-b-2 border-light-grey" : ""
                    } flex flex-row space-x-3 items-center pb-4 px-4`}
                >
                  <button onClick={handleBackToHome}>
                    <IoIosArrowBack size={22} />
                  </button>
                  <div className="font-Museo-Medium text-sm">{wording}</div>
                </div>
              )}
              {children}
            </div>
          ) : (
            children
          )}
          {modalValidateRegister && (
            <ModalbackRegister
              modalValidateRegister={modalValidateRegister}
              setModalValidateRegister={setModalValidateRegister}
              statusModal={"backFromRegister"}
            />
          )}
        </div>
        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && <FloatingChat />}
        <div className="bottom-0">
          <Footer />
        </div>
        <LayananPengirimanNotif />
      </div>
    </>
  );
};

export default Layout;
