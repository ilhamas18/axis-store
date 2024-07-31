import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TextInput from "@components/templates/text-input/input";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { GetOrder, GetVA } from "pages/api/igw";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setRegister } from "store/register/action";
import SEO from "@components/global/seo";
import { layerEventGA4 } from "src/data-layer";
import TroubleEsim from "@components/global/modal/trouble-esim";
import TroubleEsimMsisdn from "@components/global/modal/trouble-esim-msisdn";
import InvalidCaptchaEsim from "@components/global/modal/invalid-captcha-esim";
import {
  setAddrProvince,
  setAddrCity,
  setAddrCityType,
  setAddrDistrict,
  setAddrSubDistrict,
  setAddrZipCode,
  setAddrDetailInfo,
  setCourier,
} from "store/delivery/action";

import { setPersonal } from "store/personal/action";
import { setProductESim } from "store/product/action";
import { IoReloadCircleOutline, IoReloadOutline } from "react-icons/io5";
import {
  setPaymentMethod,
  setPaymentAccount,
  setReservedNumber,
  setTrxId,
} from "store/payment/action";
import { setEmail as setStoredEmail } from "store/payload/action";
import { setProduct } from "store/product/action";
import { setSelected, setSelectedEncrypt, setPrice } from "store/payload/action";
import ModalNotFound from "@components/pages/cek-status/modal-notfound";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { State } from "store/reducer";
import { ListProductEsimId, encryptMsisdn } from "./api/esim";
import ModalReject from "@components/global/modal/reject";
import Trouble from "@components/global/modal/trouble";
import PendingPayment from "@components/global/modal/pending-payment";
import useToast from "src/hooks/useToast";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const DeliveryStatus = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [nomor, setNomor] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [errorEmail, setErrorEmail] = useState<any>();
  const [errorNomor, setErrorNomor] = useState<any>();
  const [openIC, setOpenIC] = useState(false);
  const [openTrouble, setOpenTrouble] = useState(false);
  const [openTroubleMsisdn, setOpenTroubleMsisdn] = useState(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openNotFound, setOpenNotFound] = useState<boolean>(false);
  const [openPending, setPending] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const addToast: any = useToast();

  const { uuid } = useSelector((state: State) => ({
    uuid: state.uuid.uuid
  }), shallowEqual);

  const dispatch = useDispatch();

  const getVA = async (msisdn: string, payment_type: string, type: string = "") => {
    try {
      let payload = {};
      if (type) {
        payload = {
          uuid,
          msisdn: msisdn,
          payment_type: payment_type,
          type: type
        };
      } else {
        payload = {
          uuid,
          msisdn: msisdn,
          payment_type: payment_type,
        };
      }
      const get = await GetVA(payload);

      return get;
    } catch (error) { }
  };

  const spStatus = async (data: any) => {
    dispatch(setTrxId(data.transactionId));
    dispatch(
      setCourier({
        name: data.delivery.courierCode,
        group: data.delivery?.serviceCode,
        code: data.delivery?.serviceCode,
        price: data.delivery.amount,
        est: "",
      })
    );
    dispatch(
      setProduct({
        serviceId: "0",
        name: data.productName,
        price: data.amount,
        kuota: "",
        kuota_double: "",
        day: "30",
        cmid: "",
      })
    );

    let paymentType = "";
    let paymentCat = "ewallet";

    if (data.paymentType.toLowerCase().includes("bca")) {
      paymentCat = "va";
      paymentType = "vabca";
      dispatch(
        setPaymentMethod({
          name: "BCA",
          type: "Virtual Account",
          code: "vabca",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("bri")) {
      paymentCat = "va";
      paymentType = "vabri";
      dispatch(
        setPaymentMethod({
          name: "BRI",
          type: "Virtual Account",
          code: "vabri",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("cimb")) {
      paymentCat = "va";
      paymentType = "vacimb";
      dispatch(
        setPaymentMethod({
          name: "CIMB Niaga",
          type: "Virtual Account",
          code: "vacimb",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("gopay")) {
      paymentType = "gopay";
      dispatch(
        setPaymentMethod({
          name: "GoPay",
          type: "Ewallet",
          code: "gopay",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("ovo")) {
      paymentType = "ovo";

      dispatch(
        setPaymentMethod({
          name: "OVO",
          type: "Ewallet",
          code: "ovo",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("shopee")) {
      paymentType = "shopee";

      dispatch(
        setPaymentMethod({
          name: "ShopeePay",
          type: "Ewallet",
          code: "shopee",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("dana")) {
      paymentType = "dana";

      dispatch(
        setPaymentMethod({
          name: "DANA",
          type: "Ewallet",
          code: "dana",
        })
      );
    }

    dispatch(setAddrProvince(data.delivery.address.province));
    dispatch(setAddrCity(data.delivery.address.city));
    dispatch(setAddrCityType(data.delivery.address.cityType));
    dispatch(setAddrDistrict(data.delivery.address.district));
    dispatch(setAddrSubDistrict(data.delivery.address.village));
    dispatch(setAddrZipCode(data.delivery.address.postalCode));
    dispatch(
      setAddrDetailInfo({
        detail: data.delivery.address.addressDetail,
        info: "",
      })
    );
    dispatch(
      setPersonal({
        name: data.contact.name,
        email: data.contact.email,
        phone: data.contact.phoneNumber,
      })
    );
    dispatch(
      setRegister({
        type: "status",
        awb: data?.delivery?.awb ?? "",
      })
    );

    if (
      data.orderStatus == "CREATED" ||
      data.orderStatus == "READY" ||
      data.orderStatus == "FAILED" ||
      data.orderStatus == "EXPIRED" ||
      data.orderStatus.includes("FAIL") ||
      data.orderStatus.includes("NOT") ||
      data.orderStatus.includes("ERROR")
    ) {
      if (paymentCat == "va") {
        const get = await getVA(data.msisdn, data.paymentType);

        if (get?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: get.data?.result?.data.data?.va,
              expired: get.data?.result?.data.data?.expiredAt,
            })
          );
          if (paymentType == "vabca") {
            router.push("/pembayaran/virtual-account-bca");
          } else if (paymentType == "vabri") {
            router.push("/pembayaran/virtual-account-bri");
          } else if (paymentType == "vacimb") {
            router.push("/pembayaran/virtual-account-cimb-niaga");
          }
        } else {
          if (paymentType == "vabca") {
            router.push("/pembayaran/virtual-account-bca/timeout");
          } else if (paymentType == "vabri") {
            router.push("/pembayaran/virtual-account-bri/timeout");
          } else if (paymentType == "vacimb") {
            router.push("/pembayaran/virtual-account-cimb-niaga/timeout");
          }
        }
      } else {
        if (paymentType == "vabca") {
          router.push("/pembayaran/virtual-account-bca");
        } else if (paymentType == "vabri") {
          router.push("/pembayaran/virtual-account-bri");
        } else if (paymentType == "vacimb") {
          router.push("/pembayaran/virtual-account-cimb-niaga");
        } else if (
          paymentType == "gopay" ||
          paymentType == "ovo" ||
          paymentType == "shopee" ||
          paymentType == "dana"
        ) {
          setPending(true)
        }
      }
    } else if (
      (data.orderStatus == "INPROGRESS" ||
        data.orderStatus == "PUBLISHED" ||
        data.orderStatus == "SUCCESS") &&
      (data.delivery.status == "CREATED" ||
        data.delivery.status == "FAILED" ||
        data.delivery.status == "IN_PROGRESS")
    ) {
      router.push("/status/proses");
    } else if (
      (data.orderStatus == "INPROGRESS" ||
        data.orderStatus == "SUCCESS" ||
        data.orderStatus == "PUBLISHED") &&
      data.delivery.status == "DONE"
    ) {
      router.push("/status/kirim");
    }
  };

  const esimStatus = async (data: any, trxid: any) => {
    dispatch(setTrxId(trxid));
    dispatch(setStoredEmail(email));
    const response = await ListProductEsimId(data.productId);

    const payload = {
      id: response?.[0]?.id,
      serviceId: response?.[0]?.serviceId,
      name: response?.[0]?.name,
      price: response?.[0]?.price,
      kuota: response?.[0]?.kuota_utama,
      kuota_double: response?.[0]?.kuota_double,
      day: response?.[0]?.day,
      cmid: response?.[0]?.cdmanid,
      before_price: response?.[0]?.before_price,
      kuota_full: response?.[0]?.kuota_full,
    };

    dispatch(setProductESim(payload));

    let paymentType = "";
    let paymentCat = "ewallet";

    if (data.paymentType.toLowerCase().includes("bca")) {
      paymentCat = "va";
      paymentType = "vabca";
      dispatch(
        setPaymentMethod({
          name: "BCA",
          type: "Virtual Account",
          code: "vabca",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("bri")) {
      paymentCat = "va";
      paymentType = "vabri";
      dispatch(
        setPaymentMethod({
          name: "BRI",
          type: "Virtual Account",
          code: "vabri",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("cimb")) {
      paymentCat = "va";
      paymentType = "vacimb";
      dispatch(
        setPaymentMethod({
          name: "CIMB Niaga",
          type: "Virtual Account",
          code: "vacimb",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("gopay")) {
      paymentType = "gopay";

      dispatch(
        setPaymentMethod({
          name: "GoPay",
          type: "Ewallet",
          code: "gopay",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("ovo")) {
      paymentType = "ovo";

      dispatch(
        setPaymentMethod({
          name: "OVO",
          type: "Ewallet",
          code: "ovo",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("shopee")) {
      paymentType = "shopee";

      dispatch(
        setPaymentMethod({
          name: "ShopeePay",
          type: "Ewallet",
          code: "shopee",
        })
      );
    } else if (data.paymentType.toLowerCase().includes("dana")) {
      paymentType = "dana";

      dispatch(
        setPaymentMethod({
          name: "DANA",
          type: "Ewallet",
          code: "dana",
        })
      );
    }

    dispatch(setSelected(data.msisdn));
    dispatch(setPrice(parseInt(data.amount) - parseInt(payload.price)));

    dispatch(
      setPersonal({
        name: data.contact.fullName ?? "",
        email: data.contact.email,
        phone: data.contact.mobilePhone,
      })
    );

    if (
      data.orderStatus == "CREATED" ||
      data.orderStatus == "READY" ||
      data.orderStatus == "FAILED" ||
      data.orderStatus == "EXPIRED" ||
      data.orderStatus.includes("FAIL") ||
      data.orderStatus.includes("NOT") ||
      data.orderStatus.includes("ERROR")
    ) {
      if (paymentCat === "va") {
        const get = await getVA(data.msisdn, data.paymentType, "esim");

        if (get?.status == 200) {
          dispatch(
            setPaymentAccount({
              va_number: get.data?.result?.data.data?.va,
              expired: get.data?.result?.data.data?.expiredAt,
            })
          );
          if (paymentType == "vabca") {
            router.push("/pembayaran-esim/virtual-account-bca");
          } else if (paymentType == "vabri") {
            router.push("/pembayaran-esim/virtual-account-bri");
          } else if (paymentType == "vacimb") {
            router.push("/pembayaran-esim/virtual-account-cimb-niaga");
          }
        } else {
          if (paymentType == "vabca") {
            router.push("/pembayaran-esim/virtual-account-bca/timeout");
          } else if (paymentType == "vabri") {
            router.push("/pembayaran-esim/virtual-account-bri/timeout");
          } else if (paymentType == "vacimb") {
            router.push("/pembayaran-esim/virtual-account-cimb-niaga/timeout");
          }
        }
      } else {
        if (paymentType == "vabca") {
          router.push("/pembayaran-esim/virtual-account-bca");
        } else if (paymentType == "vabri") {
          router.push("/pembayaran-esim/virtual-account-bri");
        } else if (paymentType == "vacimb") {
          router.push("/pembayaran-esim/virtual-account-cimb-niaga");
        } else if (
          paymentType == "gopay" ||
          paymentType == "ovo" ||
          paymentType == "shopee" ||
          paymentType == "dana"
        ) {
          setPending(true)
        }
      }

    } else if (
      (data.orderStatus == "INPROGRESS" ||
        data.orderStatus == "PUBLISHED" ||
        data.orderStatus == "SUCCESS") &&
      data.paymentStatus == "SUCCESS"
    ) {
      router.push("/status/sukses");
    }
  };

  const handleNext = async () => {
    layerEventGA4({
      eventAction: "select_content",
      content_id: "interaction",
      content_type: "Button Click",
      content_name: nomor,
      content_section: "Form Interaction",
    });

    try {
      setLoadingButton(true);
      const payload = {
        captcharesponse: localStorage.getItem("handshake"),
        transactionid: nomor,
        email: email,
      };

      const order = await GetOrder(payload);

      if (order?.status == 200) {
        const encrypt = await encryptMsisdn(order?.data?.result?.data.msisdn);

        if (encrypt.status == 200) {
          const data = order?.data?.result?.data;
          const encryptedMsisdn = encrypt.data.result.data.msisdn;

          if (data.orderStatus === 'VOID-REQ-REIMBURSE') {
            setOpenReject(true);
          } else {
            dispatch(setSelectedEncrypt(encryptedMsisdn));
            if (nomor?.toLowerCase().includes('esim')) {
              esimStatus(data, nomor);
            } else {
              spStatus(data);
            }
          }
        } else {
          setOpenTrouble(true);
          setLoadingButton(false);
        }
      } else if (order?.status == 403) {
        addToast(
          "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
        )
        setTimeout(() => router.push("/"), 2500);
      } else {
        setOpenNotFound(true);
        handleReset();
      }
      setLoadingButton(false);
      handleReset();
    } catch (error) {
      setOpenTrouble(true);
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("trace") != "") {
      localStorage.setItem("trace", "");
      location.reload();
    }
  }, []);

  const handleReset = () => {
    try {
      window.grecaptcha.reset();
    } catch (error) {
      console.log(error);
      location.reload();
    }
  };

  function onchange(value: any) {
    setToken(value);
    localStorage.setItem("handshake", value);
  }

  function ValidateEmail(value: string) {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
    if (value?.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  const validationForm = () => {
    if (email != "" && email.length > 2) {
      if (!ValidateEmail(email)) {
        setErrorEmail("Format email salah");
        setSolved(false);

        return false;
      }
      if (!email.split("@")[1].includes(".")) {
        setSolved(false);
        setErrorEmail("Format email salah");
        return false;
      }
    }

    setErrorEmail("");
    setErrorNomor("");

    return true;
  };

  useEffect(() => {
    validationForm();
    if (nomor != "" && email != "") {
      setSolved(true);
    } else {
      setSolved(false);
    }
  }, [nomor, email]);

  return (
    <div className="service-container">
      <SEO
        title={"Cek Status Pesanan dan Pengiriman Kartu Perdana AXIS"}
        description="Kamu dapat melihat status pesanan dan pengiriman untuk transaksi pembelian kartu perdana AXIS di AXIS Store. Cek status pemesanan dan pengiriman kamu disini!"
      />
      <ModalNotFound
        openNotFound={openNotFound}
        setOpenNotFound={setOpenNotFound}
        setToken={setToken}
      />
      <InvalidCaptchaEsim openIC={openIC} setOpenIC={setOpenIC} />
      <TroubleEsim openTrouble={openTrouble} setOpenTrouble={setOpenTrouble} />
      <TroubleEsimMsisdn
        openTrouble={openTroubleMsisdn}
        setOpenTrouble={setOpenTroubleMsisdn}
      />

      <div className="body pb-6">
        <div className="px-4">
          <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-4">
            Cek Status Transaksi
          </div>
          <div className="form flex flex-col mb-5">
            <div className="font-Museo mb-3">
              <TextInput
                type="email"
                id="email"
                name="email"
                label="Email"
                value={email}
                errors={errorEmail}
                change={(e: any) => setEmail(e)}
              />
            </div>
            <div className="font-Museo">
              <TextInput
                type="text"
                id="nomor"
                name="nomor"
                label="Nomor Transaksi"
                value={nomor}
                errors={errorNomor}
                change={(e: any) => setNomor(e)}
              />
            </div>
          </div>
          <div className="captcha flex justify-center w-full">
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
            className="flex m-auto my-3 justify-center items-center gap-2 text-sm font-semibold"
          >
            <IoReloadOutline />{" "}
            <div>
              Muat ulang jika captcha tidak tampil <br /> untuk bisa klik
              "Lanjutkan"
            </div>
          </button>
        </div>
      </div>
      <div className="button px-4">
        <Button
          variant="axis"
          className="button-container mt-5 mb-10"
          rounded
          onClick={handleNext}
          disabled={
            !solved || !token || loadingButton || errorEmail ? true : false
          }
        >
          <div className="flex justify-center items-center font-Museo-Medium text-white">
            {!loadingButton ? (
              <span className="button-text">Cek Status Pesanan</span>
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
      <div className="px-4 mb-10">
        <div className="px-4 py-6 bg-light-blue flex flex-row items-center justify-center rounded-[12px]">
          <div className="w-[10%]">
            <RiErrorWarningLine size={23} style={{ color: "#002DBB" }} />
          </div>
          <div className="w-[90%]">
            <div className="font-Museo md:text-sm tracking-wider text-xs">
              Anda dapat melihat kode transaksi pada status halaman konfirmasi
              atau inbox pada email anda yang terdaftar.
              {/* Jika butuh bantuan
              lebih lanjut silahkan hubungi{" "}
              <Link href="loremipsum@gmail.com" legacyBehavior>
                <a className="text-biruxl">loremipsum@gmail.com</a>
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <ModalReject openReject={openReject} setOpenReject={setOpenReject} />
      <PendingPayment openPending={openPending} setPending={setPending} />
    </div>
  );
};

export default DeliveryStatus;
