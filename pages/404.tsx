import SEO from "@components/global/seo";
import { Button } from "@components/templates/button/button";
import Image from "next/image";

export default function Custom404() {
  return (
    <>
      <SEO title={"Halaman Tidak Ditemukan 404"}></SEO>
      <div className="container p-4 m-auto mt-20 md:mt-5 grid md:grid-flow-col-dense grid-cols-1 md:grid-cols-2 place-items-center align-middle md:min-h-[60dvh] min-h-[80dvh]">
        <div className="heading order-2 md:order-1 flex flex-col justify-end w-full md:w-11/12 text-center md:text-justify">
          <h1 className="text-3xl md:text-4xl font-bold text-biruxl mb-1">
            Ooops. Sepertinya kamu tersesat
          </h1>
          <p className="text-lg md:text-xl my-4 font-Museo">
            Maaf, halaman yang kamu cari gak ada disini. kamu bisa langsung beli
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
            variant="xl-green"
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
        <div className="order-1 md:order-2 flex justify-center items-end">
          <img src="/notfound.png" className="w-full" alt="Notfound" />
        </div>
      </div>
    </>
  );
}
