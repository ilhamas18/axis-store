import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TextInput from "@components/templates/text-input/input";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import Total from "@components/global/total";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setPersonal } from "store/personal/action";
import { State } from "store/reducer";
import SEO from "@components/global/seo";
import {
  addsRegistrasiLand,
  addsRegistrasiAction,
} from "src/data-layer/adds";
import Script from "next/script";

const Registration = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { personal } = useSelector(
    (state: State) => ({
      personal: state.personal.personal,
    }),
    shallowEqual
  );

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailConfirmation, setEmailConfirmation] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [errorName, setErrorName] = useState<any>();
  const [errorEmail, setErrorEmail] = useState<any>();
  const [errorEmailConfirm, setErrorEmailConfirm] = useState<any>();
  const [errorPhone, setErrorPhone] = useState<any>();

  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    setName(personal?.name ?? "");
    setEmail(personal?.email ?? "");
    setPhone(personal?.phone ?? "");
    addsRegistrasiLand();
    if (localStorage.getItem("/registrasi") == "true") {
      setEmailConfirmation("");
    }
  }, [router]);

  function ValidateName(value: string) {
    let validRegex = /^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/;
    if (value?.match(validRegex)) {
      return true;
    } else {
      return false;
    }
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

  function ValidatePhone(value: string) {
    let validRegex = /^[0-9]+$/;
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
    if (name.length > 1) {
      if (!ValidateName(name)) {
        setErrorName("Format nama salah");
        return false;
      }
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
    // if (phone.length > 3) {
    //   if (!ValidatePhone(email)) {
    //     setErrorPhone("Format email salah");
    //     return false;
    //   }
    // }

    setErrorName("");
    setErrorEmail("");
    setErrorEmailConfirm("");
    setErrorPhone("");

    return true;
  };

  const handleNext = () => {
    const test = validationForm();
    if (test) {
      addsRegistrasiAction();
      dispatch(
        setPersonal({
          name,
          email,
          phone,
        })
      );
      router.push({
        pathname: "/detail-pesanan",
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
    <div className="container h-full">
      <SEO title={"Registrasi"} />
      <div className="px-4">
        <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-6">
          Isi Data Diri Anda
        </div>
        <div className="form flex flex-col space-y-2">
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="text"
              id="name"
              name="name"
              label="1. Nama lengkap (wajib diisi)"
              errors={errorName}
              value={name}
              change={(e: any) => setName(e)}
              onClick={() => handleTochInput("Nama lengkap")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="email"
              id="email"
              name="email"
              label="2. Email (wajib diisi)"
              hideCopy={true}
              errors={errorEmail}
              value={email}
              change={(e: any) => setEmail(e)}
              onClick={() => handleTochInput("Email")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="email"
              id="email confirmation"
              name="email confirmation"
              label="3. Konfirmasi email (wajib diisi)"
              hideCopy={true}
              errors={errorEmailConfirm}
              value={emailConfirmation}
              change={(e: any) => setEmailConfirmation(e)}
              onClick={() => handleTochInput("Konfirmasi email")}
            />
          </div>
          <div className="font-Museo flex items-center justify-center">
            <TextInput
              type="tel"
              id="phone"
              name="phone"
              label="4. No telp (wajib diisi)"
              errors={errorPhone}
              value={phone}
              change={(e: any) => setPhone(e)}
              onClick={() => handleTochInput("No telp")}
            />
          </div>
        </div>
        <div className="px-4 py-6 mt-6 bg-light-blue flex flex-row items-center rounded-[12px] mb-4">
          <div>
            <RiErrorWarningLine size={23} style={{ color: "#6F2B90" }} />
          </div>
          <div className="ml-4">
            <div className="font-Museo-Light md:text-md tracking-wider text-sm">
              Untuk dapat melanjutkan proses, anda wajib mengisi semua informasi
              diatas
            </div>
          </div>
        </div>
      </div>
      <Total>
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

export default Registration;
