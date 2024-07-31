import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import PilihDetail from "@components/pages/feature/Pilih/sp/detail";
import ModalDetail from "@components/pages/feature/Pilih/sp/modal-detail";
import ModalType from "@components/pages/feature/Pilih/sp/modal-type";
import SEOFooter from "@components/global/footer/seo-footer";
import SEO from "@components/global/seo";
import { addsPilihLand } from "src/data-layer/adds";

const PilihFeatureB = () => {
  const refViewScroll = useRef<null | HTMLDivElement>(null);
  const [inViewIndex, setInViewIndex] = useState<boolean>(true);
  const [inViewIndexAll, setInViewIndexAll] = useState<boolean>(true);

  const [modalDetail, setModalDetail] = useState<boolean>(false);
  const [modalDetailType, setModalDetailType] = useState<boolean>(false);
  const [modalDetailData, setModalDetailData] = useState<object>({});
  const [modalDetailDataType, setModalDetailDataType] = useState<object>({});

  const handleChangeTraker = useCallback(
    (data: any, index: number) => {
      if (inViewIndex) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "ViewContent",
          product_name: `${data.name} - ${data.kuota_full}`,
          product_value: data.price,
        });
      }
      if (index === 2) {
        setInViewIndex(false);
      }
    },
    [inViewIndex]
  );

  const handleChangeTrakerAll = useCallback(
    (data: any, index: number, length: number) => {
      let total = length - 1;
      if (inViewIndexAll) {
        handleTraker({
          eventType: "view_item_list",
          productTrack: data,
          typeTrack: data.type,
          index: index + 1,
        });
      }
      if (index === total) {
        setInViewIndexAll(false);
      }
    },
    [inViewIndexAll]
  );

  const handleTraker = ({
    eventType,
    productTrack,
    typeTrack,
    index,
  }: {
    eventType: string;
    productTrack: any;
    typeTrack: string;
    index: number;
  }) => {
    let dicount =
      typeof productTrack.before_price !== "undefined"
        ? productTrack.before_price
        : 0;
    let price =
      typeof productTrack.price !== "undefined" ? productTrack.price : 0;
    let dicountPrice = dicount - price;
    const kuota = productTrack.total_kuota
      ? productTrack.kuota_full
      : productTrack.kuota_utama;

    if (dicount === 0) {
      dicountPrice = 0;
    }
    window.dataLayer = window.dataLayer || [];
    const viewList = {
      item_id: productTrack.serviceId,
      item_name: `${productTrack.name} ${kuota}`,
      affiliation: "AXIS",
      currency: "IDR",
      discount: dicountPrice,
      index: index ? index : productTrack.index,
      item_brand: "AXIS",
      item_category: `${productTrack.name}`,
      item_category2: `${productTrack.name} - ${typeTrack}`,
      item_list_id: "pilih_paket_kamu",
      item_list_name: "Pilih Paket Kamu",
      item_variant: kuota,
      price: dicount,
      quantity: 1,
    };
    window.dataLayer.push({
      event: eventType,
      ecommerce: {
        value: "pilih_paket_kamu",
        item_list_name: "Pilih Paket Kamu",
        items: [viewList],
      },
    });
  };

  const handleDetail = (data: object) => {
    setModalDetailData(data);
    setModalDetail(true);
  };
  const handleDetailType = (data: any) => {
    if (data.type === "detail") {
      setModalDetail(false);
      setTimeout(() => {
        setModalDetailDataType(data);
        setModalDetailType(true);
      }, 200);
      return;
    }
    setModalDetailDataType(data);
    setModalDetailType(true);
  };

  useEffect(() => {
    addsPilihLand();
  }, []);
  return (
    <div className="pilih-container">
      <SEO
        title={"Pilih Kartu Perdana Dengan Paket Yang Kamu Inginkan"}
        description="Dapatkan beragam promo diskon hingga kuota untuk setiap pembelian kartu perdana AXIS di AXIS Store. Pilih kartu perdana dengan paket yang kamu inginkan disini!"
      />
      <div className="flex flex-col space-y-2 text-left px-4 mt-4">
        <div className="title font-Museo-Bold text-3xl text-xl tracking-wider">
          Pilih Kuota Internet Kamu
        </div>
        <div className="subtitle">
          <div className="font-Museo-Light text-md tracking-wider md:mb-3">
            <p>
              Yuk cari kuota internet, sebelum kamu memilih tipe SIM yang pas
              untuk kamu
            </p>
          </div>
        </div>
        <div ref={refViewScroll}>
          <PilihDetail
            handleTraker={handleTraker}
            handleChangeTrakerAll={handleChangeTrakerAll}
            handleChangeTraker={handleChangeTraker}
            handleDetail={handleDetail}
            handleDetailType={handleDetailType}
            setModal={setModalDetailType}
          />
        </div>
      </div>
      {modalDetail && (
        <ModalDetail
          data={modalDetailData}
          modal={modalDetail}
          setModal={setModalDetail}
        />
      )}
      {modalDetailType && (
        <ModalType
          data={modalDetailDataType}
          modal={modalDetailType}
          setModal={setModalDetailType}
        />
      )}
    </div>
  );
};

export default PilihFeatureB;
