import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import ReCAPTCHA from "react-google-recaptcha";
import { IoReloadCircleOutline, IoReloadOutline } from "react-icons/io5";

interface type {
  openIC: boolean;
  setOpenIC: any;
}

const InvalidCaptchaEsim = ({ openIC, setOpenIC }: type) => {
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  const onClose = () => {
    setOpenIC(false);
  };

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

  return (
    <CommonModal isOpen={openIC} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/error.png"
          width={89.31}
          height={96.79}
          alt="Error"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Token Captha Kadaluarsa
        </div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Silahkan verifikasi kembali
          <div className="captcha flex justify-center w-full pt-3">
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
            <IoReloadOutline /> <div>muat ulang captcha</div>
          </button>
        </div>
        <Button
          variant="axis"
          className="button-container mb-2 mt-5"
          rounded
          onClick={() => onClose()}
        >
          <div className="flex justify-center items-center text-white font-Museo">
            <span className="button-text">OK</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  );
};

export default InvalidCaptchaEsim;
