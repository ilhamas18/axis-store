import Image from "next/image";
import { useState } from "react";

import ModalBottomSheet from "@components/global/modal/bottom-sheet";
import { capitalize } from "@mui/material";
import Radio from "@mui/material/Radio";

interface type {
  modal: boolean;
  setModal: any;
  data: any;
}

const ModalType = ({ modal, setModal, data }: type) => {
  const [isActive, setActive] = useState("card-1");
  const [isSelected, setSelected] = useState(data.data.combineCard[0]);

  const renderCard = ({
    active,
    selected,
  }: {
    active: string;
    selected: any;
  }) => {
    let title = "Kartu SIM";
    let des =
      "Hemat waktu dan tenaga, beli kartu perdana langsung dateng ke rumah kamu";
    let img = "ic_sim";
    if (selected.type === "eSIM") {
      title = "eSIM";
      des = "Aktifin nomor baru dalam hitungan menit, tanpa kartu fisik";
      img = "ic_esim";
    }
    return (
      <div
        onClick={() => {
          setActive(active);
          setSelected(selected);
        }}
        className={`${
          isActive === active &&
          "border-teal-500 shadow-[0px_4px_16px_0px_#3E225F1A]"
        } cursor-pointer h-full border-[1px] rounded-lg mb-4`}
      >
        <div className="flex w-full justify-between items-center">
          <div className="p-3 border-light-gray flex">
            <Image
              src={`/icons/${img}.png`}
              width={80}
              height={80}
              className="!h-[70px] !w-[70px]"
              alt="Ganti nomor"
            />
            <div className="ml-3">
              <div className="font-Museo-Bold text-lg">{title}</div>
              <div className="font-Museo-Light text-sm text-[#333333]">
                {des}
              </div>
            </div>
          </div>
          <div className="checkbox mt-1 mr-1">
            <Radio
              id="courier_modal"
              checked={isActive === active ? true : false}
              sx={{
                color: "#999",
                "&.Mui-checked": {
                  color: "#00E2BC",
                },
              }}
            />
          </div>
        </div>
        {selected.tag.flat_ongkir_status && (
          <div className="p-3 flex border-t-[1px]">
            <Image
              src={`/icons/ic-flat.svg`}
              width={25}
              height={25}
              className="!h-[25px] !w-[25px] mt-1.5"
              alt="Ganti nomor"
            />
            <div className="ml-2.5">
              <div className="uppercase font-Museo-Bold text-xs text-[#3D2360]">
                {capitalize(selected.tag.flat_ongkir[0].flat_ongkir_title)}
              </div>
              <div className="font-Museo-Light text-xs text-[#3D2360]">
                {capitalize(selected.tag.flat_ongkir[0].flat_ongkir_txt)}
              </div>
            </div>
          </div>
        )}
        {selected.tag.cashback_status &&
          selected.tag.payment.map((item: any, i: number) => (
            <div className="p-3 flex border-t-[1px]" key={i}>
              <Image
                src={item.brand_image}
                width={25}
                height={25}
                className="!h-[25px] !w-[25px] mt-1.5"
                alt="Ganti nomor"
              />
              <div className="ml-2.5">
                <div className="uppercase font-Museo-Bold text-xs text-[#3D2360]">
                  {capitalize(item.cashback_brand_title)}
                </div>
                <div className="font-Museo-Light text-xs text-[#3D2360]">
                  {capitalize(item.cashback_brand_txt)}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <ModalBottomSheet
      modal={modal}
      setModal={setModal}
      className="wrapper-pilih"
      classNameBtn="text-md font-Museo-Bold uppercase tracking-wides"
      title="Pilih Tipe"
      onClickAction={{
        label: "Lanjut",
        action: () => {
          data.handleChange(isSelected);
        },
      }}
    >
      <div className="mt-3">
        {renderCard({ active: "card-1", selected: data.data.combineCard[0] })}
        {data.data.combineCard.length === 2 &&
          renderCard({ active: "card-2", selected: data.data.combineCard[1] })}
      </div>
    </ModalBottomSheet>
  );
};

export default ModalType;
