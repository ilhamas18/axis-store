import { useEffect, useState } from "react";
import Image from "next/image";
import ModalBottomSheet from "../modal/bottom-sheet";
import { deviceList } from "./deviceList";
import { BiSearch } from "react-icons/bi";

interface type {
  modal: boolean,
  setModal: any
}

const DeviceDetail = ({ modal, setModal }: type) => {
  const [search, setSearch] = useState<string>('');
  const [filteredList, setFilteredList] = useState<any>([]);

  useEffect(() => {
    setFilteredList(deviceList.filter((item: any) => item.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  return (
    <ModalBottomSheet
      modal={modal}
      setModal={setModal}
      title="Cari merk HP kamu disini"
      className="wrapper-device-detail"
      scrollContent
    >
      <div className="device-list-container">
        <div className="flex gap-3 items-center border border-light-gray rounded-3xl px-4 py-2 mt-6">
          <input
            type="text"
            id="search"
            name="search"
            value={search}
            placeholder="Ketik nama perangkat/brand HP"
            onChange={(e) => setSearch(e.target.value)}
            className="focus:outline-none w-full outline-none text-Axiata-Book"
          />
          <BiSearch size={20} className="text-biruxl" />
        </div>
        <div className="body flex flex-col font-Museo-Medium md:text-md text-sm">
          {filteredList.length != 0 ? (
            <>
              <div className="font-Museo-Bold md:text-lg text-md text-[#A2AE1E] uppercase tracking-wider mt-6">eSIM available</div>
              {filteredList.map((item: any, i: number) => (
                <div className="border-b border-light-gray py-3" key={i}>{item}</div>
              ))
              }
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-6 gap-2 mb-4">
              <Image src="/icons/info-esim/blank.svg" width={200} height={133} alt="Blank" />
              <span className="font-Museo-Light text-sm">Maaf, Brand atau perangkat belum mendukung eSIM</span>
            </div>
          )}
        </div >
      </div >
    </ModalBottomSheet >
  )
}

export default DeviceDetail