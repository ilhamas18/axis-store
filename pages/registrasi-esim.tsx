import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TextInput from "@components/templates/text-input/input";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { setExisting, setName, setEmail } from "store/payload/action";
import SEO from "@components/global/seo";
import {
  addsRegistrasiLand,
  addsRegistrasiAction,
} from "src/data-layer/adds";
import Total from "@components/global/total";

const RegistrationEsim = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { payload } = useSelector(
    (state: State) => ({
      payload: state.payload,
    }),
    shallowEqual
  );

  const [name, setNameEsim] = useState<string>("");
  const [email, setEmailEsim] = useState<string>("");
  const [emailConfirmation, setEmailConfirmation] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [errorName, setErrorName] = useState<any>();
  const [errorEmail, setErrorEmail] = useState<any>();
  const [errorEmailConfirm, setErrorEmailConfirm] = useState<any>();
  const [errorPhone, setErrorPhone] = useState<any>();

  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    setNameEsim(payload?.name ?? "");
    setEmailEsim(payload?.email ?? "");
    setPhone(payload?.existing ?? "");
    addsRegistrasiLand();
    if (router?.query?.edit == "true") {
      setEmailConfirmation(payload?.email ?? "");
    }
  }, [router]);

  function ValidateEmail(value: string) {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
    if (value?.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    validationForm();
    if (name != "" && email != "" && emailConfirmation != "" && phone != "") {
      setSolved(true);
    } else {
      setSolved(false);
    }
  }, [name, email, emailConfirmation, phone]);

  const validationForm = () => {
    if (name != "") {
      setErrorName("");
    }

    if (phone != "") {
      setErrorPhone("");
    }

    if (email != "" && email.length > 2) {
      if (!ValidateEmail(email)) {
        setErrorEmail("Format email salah");
        return false;
      }
      if (!email.split("@")[1].includes(".")) {
        setErrorEmail("Format email salah");
        return false;
      }
      setErrorEmail("");
    }
    if (emailConfirmation != "" && emailConfirmation.length > 2) {
      if (email == "") {
        setErrorEmail(true);
        setErrorEmailConfirm("Anda harus mengisi email terlebih dahulu");
        return false;
      }
      if (!ValidateEmail(emailConfirmation)) {
        setErrorEmailConfirm("Penulisan email tidak sesuai");
        return false;
      }
      if (!emailConfirmation.split("@")[1].includes(".")) {
        setErrorEmailConfirm("Format email salah");
        return false;
      }
      setErrorEmailConfirm("");
    }

    if (
      email !== "" &&
      emailConfirmation != "" &&
      emailConfirmation.length > 2
    ) {
      if (email !== emailConfirmation) {
        setErrorEmail(true);
        setErrorEmailConfirm("Konfirmasi Email Tidak Sama");
        return false;
      }
    }
    if ((email != "" || phone != "") && name == "") {
      setErrorName("Nama tidak boleh kosong");
      return false;
    }
    if (email != "" && emailConfirmation != "" && phone == "") {
      setErrorPhone("Nomor tidak boleh kosong");
      return false;
    }

    setErrorName("");
    setErrorEmail("");
    setErrorEmailConfirm("");
    setErrorPhone("");

    return true;
  };

  const handleNext = () => {
    const test = validationForm();
    if (test) {
      dispatch(setExisting(phone));
      dispatch(setName(name));
      dispatch(setEmail(email));
      addsRegistrasiAction();
      router.push({
        pathname: "/detail-pesanan-esim",
        query: {
          ...router?.query,
        },
      });
    }
  };
  const handleTochInput = (name: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "select_content",
      content_id: "interaction",
      content_type: "Field Click",
      content_name: name,
      content_section: "Form Interaction",
    });
  };
  return (
    <div className="container">
      <SEO title={"Registrasi Esim"} />

      <div className="px-4 pb-4">
        <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6 mb-4">
          Isi Data Diri Anda
        </div>
        <div className="form flex flex-col space-y-2">
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="text"
              id="name"
              name="name"
              label="1. Nama lengkap *"
              errors={errorName}
              value={name}
              change={(e: any) => setNameEsim(e)}
              max={30}
              onClick={() => handleTochInput("Nama lengkap")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="tel"
              id="phone"
              name="phone"
              label="2. No telp *"
              errors={errorPhone}
              value={phone}
              change={(e: any) => setPhone(e)}
              max={15}
              onClick={() => handleTochInput("No telp")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="email"
              id="email"
              name="email"
              label="3. Email *"
              hideCopy={true}
              errors={errorEmail}
              value={email}
              change={(e: any) => setEmailEsim(e)}
              max={40}
              onClick={() => handleTochInput("Email")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="email"
              id="email confirmation"
              name="email confirmation"
              label="4. Konfirmasi email *"
              hideCopy={true}
              errors={errorEmailConfirm}
              value={emailConfirmation}
              change={(e: any) => setEmailConfirmation(e)}
              max={40}
              onClick={() => handleTochInput("Konfirmasi email")}
            />
          </div>
        </div>
        <div className="px-4 py-6 bg-light-blue flex flex-row items-center justify-center rounded-[12px] mb-8 mt-6">
          <div className="w-[10%]">
            <RiErrorWarningLine size={23} style={{ color: "#002DBB" }} />
          </div>
          <div className="w-[90%]">
            <div className="font-Museo-Light md:text-md tracking-wider text-xs">
              Untuk dapat melanjutkan proses, anda wajib mengisi semua informasi
              diatas
            </div>
          </div>
        </div>
      </div>
      <Total type="esim">
        <Button
          variant="axis"
          className="button-container"
          rounded
          onClick={handleNext}
          disabled={
            !solved ||
              errorName ||
              errorEmail ||
              errorEmailConfirm ||
              errorPhone
              ? true
              : false
          }
        >
          <div className="flex justify-center items-center font-Museo-Medium text-white">
            <span className="button-text tracking-widest">LANJUT</span>
          </div>
        </Button>
      </Total>
    </div>
  );
};

export default RegistrationEsim;
