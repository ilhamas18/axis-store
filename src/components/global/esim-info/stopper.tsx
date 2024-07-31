import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ModalBottomSheet from "../modal/bottom-sheet";
import { Button } from "@components/templates/button/button";
import DeviceDetail from "./deviceDetail";
import { GrNext } from "react-icons/gr";

interface type {
  modal: boolean;
  setModal: any;
  objdata: any;
  setOpenDeviceList: any;
}

const StopperESimInfo = ({ modal, setModal, objdata, setOpenDeviceList }: type) => {
  const router = useRouter();

  const handleNext = () => {
    if (router?.query?.edit == "true") {
      router.push({
        pathname: "/detail-pesanan-esim",
        query: {
          ...router?.query,
          paket: objdata.initial_packet,
        },
      });
    } else {
      if (router?.query?.category != undefined) {
        router.push({
          pathname: "/pilih-esim",
          query: {
            ...router?.query,
            paket: objdata.initial_packet,
          },
        });
      } else {
        router.push({
          pathname: "/pilih-esim",
          query: {
            ...router?.query,
            paket: objdata.initial_packet,
            category: 1,
          },
        });
      }
    }
  }

  const handleOpenDeviceList = () => setOpenDeviceList(true);

  return (
    <ModalBottomSheet
      modal={modal}
      setModal={setModal}
      className="wrapper-esim-info"
      scrollContent
    >
      <div className="stopper-esim-container mt-6 flex flex-col justify-between min-h-[95%]">
        <div>
          <div className="w-[70%] title font-Museo-Medium md:text-2xl text-xl tracking-wider">
            Baca Info Dibawah Sebelum Membeli eSIM
          </div>
          <div className="body flex flex-col gap-4 font-Museo-Light md:text-md text-sm mt-12">
            <div className="flex gap-4 items-center">
              <Image src="/icons/info-esim/step1.svg" width={40} height={40} alt="Step 1" />
              <span>eSIM hanya bisa digunakan di HP yang IMEI-nya terdaftar di Kemenperin, yaitu HP bergaransi distributor resmi Indonesia</span>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-4 items-center">
                <Image src="/icons/info-esim/step2.svg" width={40} height={40} alt="Step 2" />
                <span>Berikut HP yang IMEI-nya berpotensi tidak terdaftar di Kemenperin :</span>
              </div>
              <div className="ml-[70px]">
                <ul className="list-disc">
                  <li>HP tanpa garansi resmi atau dengan garansi internasional</li>
                  <li>HP bekas atau <span className="italic">refurbished</span></li>
                  <li>HP yang dibeli di luar negeri</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Image src="/icons/info-esim/step3.svg" width={40} height={40} alt="Step 3" />
              <span>Bila IMEI HP tidak terdaftar di Kemenperin, nomor eSIM tidak akan terhubung ke jaringan seluler</span>
            </div>
            <div className="flex gap-4 items-center">
              <Image src="/icons/info-esim/step4.svg" width={40} height={40} alt="Step 4" />
              <span>Hubungi customer service XL Axiata di 817 untuk mengetahui keresmian IMEI kamu</span>
            </div>
            <div className="card bg-white shadow-lg border border-gray-100 rounded-lg px-4 py-3 hover:cursor-pointer" onClick={handleOpenDeviceList}>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Image src="/icons/info-esim/esim.svg" width={40} height={40} alt="ESim" />
                  <div className="flex flex-col">
                    <div className="font-Museo">Belum yakin HP kamu bisa eSIM?</div>
                    <div className="font-Museo-Bold tracking-wider">Cari merk HP kamu disini</div>
                  </div>
                </div>
                <div>
                  <GrNext size={14} color="#0AC4A9" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button">
          <Button
            variant="axis"
            className="button-container"
            rounded
            onClick={handleNext}
          >
            <div className="flex justify-center items-center font-Museo-Medium text-white">
              <span className="button-text tracking-widest">LANJUT</span>
            </div>
          </Button>
        </div>
      </div>
    </ModalBottomSheet>
  )
}

export default StopperESimInfo;