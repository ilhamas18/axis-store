import SEO from "@components/global/seo";
import { Button } from "@components/templates/button/button";
import Image from "next/image";

export default function Custom500() {
  return (
    <>
      <SEO title={"Halaman Error 500"}></SEO>
      <div className="container p-4 m-auto flex flex-col w-full text-center items-center justify-center mt-20 md:mt-5 place-items-center align-middle md:min-h-[60dvh] min-h-[80dvh]">
        <div className="heading font-Museo-Bold w-full text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-biruxl mb-1">
            Ooops. Koneksi bermasalah.<br /> Silakan tunggu sesaat lagi.
          </h1>
          <p className="text-lg md:text-xl my-8 font-Museo">
            Kamu bisa langsung beli
            kartu perdana disini atau kembali ke halaman utama.
          </p>
          <Button
            variant="axis"
            className="button-container md:mt-7 mt-10 "
            rounded
            onClick={() => {
              location.href = location.origin + "/pilih";
            }}
          >
            <div className="flex justify-center items-center font-Museo-Medium ">
              <span className="button-text">Beli Disini</span>
            </div>
          </Button>
          <Button
            variant="axis"
            type="secondary"
            className="button-container mt-3"
            rounded
            onClick={() => {
              location.href = location.origin;
            }}
          >
            <div className="flex justify-center items-center font-Museo-Medium ">
              <span className="button-text">Kembali ke halaman utama</span>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
