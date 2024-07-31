import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect } from "react";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";

interface type {
  openNotFound: boolean;
  setOpenNotFound: any;
  setToken: any;
}

const ModalNotFound = ({ openNotFound, setOpenNotFound, setToken }: type) => {
  const router = useRouter();

  const onClose = () => {
    setToken("");
    setOpenNotFound(false);
  };

  useEffect(() => {
    if (openNotFound) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_content",
        content_id: "System Error",
        content_type: "Pop Up Error",
        content_name: "Maaf email atau kode transaksi yang anda masukan salah",
        content_section: "Pop Up",
      });
    }
  }, [openNotFound]);
  return (
    <CommonModal isOpen={openNotFound} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/sorry.png"
          width={89.31}
          height={96.79}
          alt="Sorry"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Maaf email atau kode transaksi yang anda masukan salah
        </div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Mohon perhatikan format penulisan pada kolom email dan kolom kode
          transaksi. Anda dapat melihat kode transaksi pada inbox yang kami
          kirimkan pada email anda yang terdaftar
        </div>
        <Button
          variant="axis"
          className="button-container mb-2 mt-5"
          rounded
          onClick={() => onClose()}
        >
          <div className="flex justify-center items-center text-white font-Museo">
            <span className="button-text">Tutup</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  );
};

export default ModalNotFound;
