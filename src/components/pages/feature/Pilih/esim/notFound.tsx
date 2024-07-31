import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center mx-12 mt-12">
      <Image
        src={"/esim/confirmation.svg"}
        width={158}
        height={231.84}
        alt="Icon loading"
      />

      <>
        <h3 className="font-bold my-4 text-xl tracking-wider mt-4 mb-4 md:text-2xl text-lg">
          Nomor pilihan Anda belum tersedia, Lihat nomor lainnya
        </h3>
      </>
    </div>
  );
};

export default NotFound;
