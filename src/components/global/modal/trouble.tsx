import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect } from "react";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";

interface type {
  openTrouble: boolean;
  setOpenTrouble: any;
}

const Trouble = ({ openTrouble, setOpenTrouble }: type) => {
  const router = useRouter();

  const onClose = () => {
    setOpenTrouble(false);
    // router.push({
    //   pathname: "/detail-pesanan/",
    //   query: {
    //     ...router.query,
    //   },
    // });
  };

  useEffect(() => {
    if (openTrouble) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_content",
        content_id: "System Error",
        content_type: "Pop Up Error",
        content_name: "Sistem sedang gangguan",
        content_section: "Pop Up",
      });
    }
  }, [openTrouble]);
  return (
    <CommonModal isOpen={openTrouble} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image src="/icons/error.png" width={89.31} height={96.79} alt="Error" />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">Sistem sedang gangguan</div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Mohon maaf karena terdapat gangguan pada sistem. Anda dapat mencoba beberapa saat lagi
        </div>
        <Button variant="axis" className="button-container mb-2 mt-5" rounded onClick={() => onClose()}>
          <div className="flex justify-center items-center text-white font-Museo">
            <span className="button-text">Tutup</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  );
};

export default Trouble;
