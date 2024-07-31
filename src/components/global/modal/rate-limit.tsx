import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";

interface type {
  modalRateLimit: boolean;
  setModalRateLimit: any;
}

const RateLimit = ({ modalRateLimit, setModalRateLimit }: type) => {
  const router = useRouter();

  const onClose = () => {
    setModalRateLimit(false);
    router.push('/');
  };

  return (
    <CommonModal isOpen={modalRateLimit} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/info.png"
          width={100}
          height={100}
          className="mt-1"
          alt="Timeout"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Mohon Maaf :(
        </div>
        <div className="font-Museo-Light md:text-md text-md text-center">
          Terlalu banyak permintaan, silakan coba lagi nanti.
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

export default RateLimit;
