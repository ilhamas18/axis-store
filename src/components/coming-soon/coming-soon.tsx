import Image from "next/image";

const ComingSoon = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center mx-12 mt-4 mb-14">
      <Image
        src={'/icons/pilih-esim/coming-soon.svg'}
        width={154}
        height={154}
        alt="Coming soon"
      />
      <h3 className="font-bold my-4 text-xl tracking-wider mt-8 mb-4 text-center">Segera Hadir Nomor Cantik Banget untuk eSIM Kamu</h3>
    </div>
  );
}

export default ComingSoon