import Image from "next/image";

import { addsPilihAction } from "src/data-layer/adds";
import ModalBottomSheet from "@components/global/modal/bottom-sheet";

interface type {
  modal: boolean;
  setModal: any;
  data: any;
}

const ModalDetail = ({ modal, setModal, data }: type) => {
  return (
    <ModalBottomSheet
      modal={modal}
      setModal={setModal}
      title="Benefit Paket"
      scrollContent
      onClickAction={{
        label: "Beli",
        action: () => {
          data.handleAction();
          addsPilihAction();
        },
      }}
    >
      <div className="border-b border-light-gray pb-4">
        <div className="font-Museo-Bold text-lg mb-4">Benefit Paket</div>
        <div className="body mt-3 flex flex-col space-y-3">
          {data.benefit?.map((item: any, index: number) => (
            <div className="flex justify-between" key={index}>
              {item.item_icon === "internet" && (
                <>
                  <div className="flex">
                    <div className="icon mr-3">
                      <Image
                        src={`/icons/pilih/${item.item_icon}.svg`}
                        width={24}
                        height={24}
                        alt={item.item_icon}
                      />
                    </div>
                    <div className="name">
                      <div className="font-Museo text-md">
                        {item?.item_name}
                      </div>
                    </div>
                  </div>
                  <div className="name text-right">
                    <div className="font-Museo-Bold text-md">
                      {item?.item_quota}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="flex justify-between">
            <div className="flex">
              <div className="icon mr-3">
                <Image
                  src={`/icons/pilih/${data?.benefit[0].item_icon}.svg`}
                  width={24}
                  height={24}
                  alt={data?.benefit[0].item_icon}
                />
              </div>
              <div className="name">
                <div className="font-Museo text-md">Masa Aktif</div>
              </div>
            </div>
            <div className="name text-right">
              <div className="font-Museo-Bold text-md">
                {data?.data?.masa_aktif_perbulan}
              </div>
            </div>
          </div>
          {data?.data?.total_kuota_bulanan !== "" && (
            <div className="flex justify-between pt-3">
              <div className="flex">
                <div className="icon mr-3">
                  <Image
                    src={`/icons/pilih/${data?.benefit[0].item_icon}.svg`}
                    width={24}
                    height={24}
                    alt={data?.benefit[0].item_icon}
                  />
                </div>
                <div className="name">
                  <div className="font-Museo text-md">Total Kuota Utama</div>
                </div>
              </div>
              <div className="name text-right">
                <div className="font-Museo-Bold text-md">
                  {data?.data?.total_kuota_bulanan}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="font-Museo-Bold text-lg mt-3">
          Benefit Paket Aktivasi
        </div>
        <div className="font-Museo-Light text-md">
          Klaim dapat dilakukan di aplikasi AXISNet
        </div>
        <div className="body mt-3 flex flex-col space-y-5">
          {data.kuota_loyalti?.map((item: any, index: number) => (
            <div className="flex justify-between" key={index}>
              <div className="flex">
                <div className="icon mr-3">
                  <Image
                    src={`/icons/pilih/${item.item_icon}.svg`}
                    width={24}
                    height={24}
                    alt={item.item_icon}
                  />
                </div>
                <div className="name">
                  <div className="font-Museo text-md">{item?.item_name}</div>
                </div>
              </div>
              <div className="name text-right">
                <div className="font-Museo-Bold text-md">
                  {item?.item_quota}
                </div>
              </div>
            </div>
          ))}
          {data.kuota_pelanggan_baru?.map((item: any, index: number) => (
            <div className="flex justify-between" key={index}>
              <div className="flex">
                <div className="icon mr-2">
                  <Image
                    src={`/icons/pilih/${item.item_icon}.svg`}
                    width={24}
                    height={24}
                    alt={item.item_icon}
                  />
                </div>
                <div className="name">
                  <div className="font-Museo text-md">{item?.item_name}</div>
                </div>
              </div>
              <div className="name text-right">
                <div className="font-Museo-Bold text-md">
                  {item?.item_quota}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pb-2 border-t border-light-gray mt-5">
        <div className="body flex flex-col space-y-4">
          {data.benefit?.map((item: any, index: number) => (
            <div className="flex justify-between" key={index}>
              {item.item_icon !== "internet" && (
                <>
                  <div className="flex">
                    <div className="icon mr-3">
                      <Image
                        src={`/icons/pilih/${item.item_icon}.svg`}
                        width={24}
                        height={24}
                        alt={item.item_icon}
                      />
                    </div>
                    <div className="name">
                      <div className="font-Museo text-md">
                        {item?.item_name}
                      </div>
                    </div>
                  </div>
                  <div className="name text-right">
                    <div className="font-Museo-Bold text-md">
                      {item?.item_quota}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalBottomSheet>
  );
};

export default ModalDetail;
