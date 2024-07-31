import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "../../templates/common-modal/modal";
import { Button } from "../../templates/button/button";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";

interface type {
  modal: boolean;
  setModal: any;
  clearAddress: any;
  setProvince: any;
}

const ModalClear = ({ modal, setModal, clearAddress, setProvince }: type) => {
  const { delivery } = useSelector(
    (state: State) => ({
      delivery: state.delivery,
    }),
    shallowEqual
  );

  const router = useRouter();

  const onClose = () => {
    setProvince(delivery.province);
    setModal(false);
  };
  const handleClear = () => {
    clearAddress();
    onClose();
  };

  return (
    <CommonModal isOpen={modal} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/question.png"
          width={89.31}
          height={96.79}
          alt="Question"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Apakah Anda ingin menghapus informasi lokasi ini?
        </div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Jika dihapus, maka seluruh lokasi yang sudah terisi dibawahnya akan
          ikut hilang{" "}
        </div>
        <Button
          variant="axis"
          type="secondary"
          className="button-container my-2"
          rounded
          onClick={handleClear}
        >
          <div className="flex justify-center items-center font-Museo">
            <span className="button-text">Ya Hapus</span>
          </div>
        </Button>
        <Button
          variant="axis"
          className="button-container my-2"
          rounded
          onClick={onClose}
        >
          <div className="flex justify-center items-center text-white font-Museo">
            <span className="button-text">Tidak Hapus</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  );
};

export default ModalClear;
