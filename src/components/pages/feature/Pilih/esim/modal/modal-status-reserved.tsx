import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";

interface type {
  modalReserved: boolean;
  setModalReserved: any;
}

const ModalStatusReserved = ({ modalReserved, setModalReserved }: type) => {
  const router = useRouter();

  const onClose = () => {
    setModalReserved(false);
  };

  return (
    <CommonModal isOpen={modalReserved} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/esim/reserved_failed.svg"
          width={124}
          height={124}
          alt="Sorry"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Oops, Nomor pilihanmu sudah dipilih pelanggan lain
        </div>
        <div className="font-Museo-Light md:text-md text-md text-center space-x-4 border-b-2 border-light-greyflex pb-4 px-4">
          Karena terlalu lama memilih nomor, nomor pilihanmu sudah terlebih
          dahulu dipesan orang lain. Tapi jangan khawatir, kamu tetap bisa
          memilih nomor lain untuk eSIM mu.
        </div>
        <Button
          variant="axis"
          className="button-container mb-2 mt-5"
          rounded
          onClick={() => onClose()}
        >
          <div className="flex justify-center items-center text-white font-Museo-Medium">
            <span className="button-text">Pilih Nomor Lain</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  );
};

export default ModalStatusReserved;
