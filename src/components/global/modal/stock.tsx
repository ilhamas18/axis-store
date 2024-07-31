import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect } from "react";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import Link from "next/link";

interface type {
  openNotStock: boolean;
  setNotStock: any;
}

const Stock = ({ openNotStock, setNotStock }: type) => {
  const router = useRouter();

  const onClose = () => {
    // location.reload();
    setNotStock(false);
  };

  useEffect(() => {
    if (openNotStock) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_content",
        content_id: "System Error",
        content_type: "Pop Up Error",
        content_name: "Maaf, stok kartu perdana sedang kosong",
        content_section: "Pop Up",
      });
    }
  }, [openNotStock]);
  return (
    <CommonModal isOpen={openNotStock} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <Image
          src="/icons/empty.png"
          width={100}
          height={100}
          alt="Empty Stock"
        />
        <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
          Maaf, stok kartu perdana sedang kosong{" "}
        </div>
        <div className="font-Museo-Light md:text-md text-sm text-center">
          Silahkan tunggu beberapa waktu untuk melakukan pemesanan kembali.
          {/* , atau
          kamu dapat menghubungi kami melalui{" "}
          <Link href="loremipsum@gmail.com" legacyBehavior>
            <a className="text-biruxl">loremipsum@gmail.com</a>
          </Link> */}
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

export default Stock;
