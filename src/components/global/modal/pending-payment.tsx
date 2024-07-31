import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import Link from "next/link";

interface type {
  openPending: boolean;
  setPending: any;
}

const PendingPayment = ({ openPending, setPending }: type) => {
  const router = useRouter();

  const onClose = () => {
    // location.reload();
    setPending(false);
  };

  return (
    <CommonModal isOpen={openPending} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/no-paid.png"
          width={100}
          height={100}
          alt="Pending Payment"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Anda belum melakukan pembayaran
        </div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Mohon selesaikan pembayaran Anda terlebih dahulu untuk dapat melihat
          status pesanan Anda
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

export default PendingPayment;
