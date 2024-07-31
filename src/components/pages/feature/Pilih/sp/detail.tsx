import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Product from "./product";
import { setProduct, setProductESim } from "store/product/action";
import { ListProduct } from "pages/api/igw";
import { ListProductEsim } from "pages/api/esim";
import { layerEventGA3, layerEventGA4 } from "src/data-layer";
import useRequest from "src/hooks/useRequest";
import LoadingError from "@components/global/loading/loading-error";
import { addsPilihAction } from "src/data-layer/adds";
import RateLimit from "@components/global/modal/rate-limit";
import { getQueryParam } from "@components/global/mixins";
import StopperESimInfo from "@components/global/esim-info/stopper";
import DeviceDetail from "@components/global/esim-info/deviceDetail";

const PilihDetail = ({
  handleChangeTraker,
  handleChangeTrakerAll,
  handleTraker,
  handleDetail,
  handleDetailType,
  setModal
}: {
  handleChangeTraker: object;
  handleChangeTrakerAll: any;
  handleTraker: any;
  handleDetail: (data: any) => void;
  handleDetailType: (data: any) => void;
  setModal?: any
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectProduct, setSelectProduct] = useState<any>({});
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const [openStopper, setOpenStopper] = useState<boolean>(false);
  const [openDeviceList, setOpenDeviceList] = useState<boolean>(false);
  const [objData, setObjData] = useState<any>({});

  const resSIM: any = useRequest(ListProduct);
  const resESIM: any = useRequest(ListProductEsim);

  useEffect(() => {
    setLoading(true);
    if (resSIM.error) {
      setError(resSIM.error);
      setLoading(false);
      return;
    }
    if (resSIM.error) {
      setError(resESIM.error);
      setLoading(false);
      return;
    }
    if (!resESIM.loading && !resSIM.loading) {
      const resSIMCom = resSIM.data.filter(
        (filter: any) => filter.status_onboard_active
      );
      const resESIMCom = resESIM.data.filter(
        (filter: any) => filter.status_onboard_active
      );

      resSIMCom.forEach((item: any) => {
        item.combined_name_kuota = `${item.name}-${item.kuota_full}`;
        item.type = "SIM";
        item.typeID = "sim";
        item.titleName = "Kartu SIM";
      });

      resESIMCom.forEach((item: any) => {
        item.combined_name_kuota = `${item.name}-${item.kuota_full}`;
        item.type = "eSIM";
        item.typeID = "esim";
        item.titleName = "eSIM";
      });

      const combinedData: Record<
        string,
        {
          [key: string]: any;
        }
      > = {};

      resSIMCom.forEach((item: any) => {
        const { combined_name_kuota } = item;

        const card1 = [item];
        const card2 = resESIMCom.filter(
          (filter: any) => filter.combined_name_kuota === combined_name_kuota
        );
        combinedData[combined_name_kuota] = combaineSend({
          card1,
          card2,
          item,
        });
      });

      resESIMCom.forEach((item: any) => {
        const { combined_name_kuota } = item;
        if (
          !combinedData[combined_name_kuota] ||
          item.price < combinedData[combined_name_kuota].price
        ) {
          const card1 = [item];
          const card2 = resSIMCom.filter(
            (filter: any) => filter.combined_name_kuota === combined_name_kuota
          );

          combinedData[combined_name_kuota] = combaineSend({
            card1,
            card2,
            item,
          });
        }
      });
      const combinedArray = Object.values(combinedData);
      setData(combinedArray);
      setLoading(false);
    }
    if (resSIM.modalRateLimit) setModalRateLimit(resSIM.modalRateLimit);
    if (resESIM.modalRateLimit) setModalRateLimit(resESIM.modalRateLimit);
  }, [resESIM.loading, resSIM.loading]);

  useEffect(() => {
    const initialPacket = getQueryParam("initial_packet");
    const packet = getQueryParam("packet");

    if (initialPacket && packet && data) {
      if (data[0].typeCombine.includes(packet)) {
        const filered = data.filter((filter: any) =>
          filter.intialCombine.includes(initialPacket)
        );
        if (filered.length !== 0) {
          let dataSort = filered[0].combineCard;
          dataSort.sort((a: any, b: any) => {
            if (a.typeID === packet) {
              return -1;
            } else if (b.typeID === packet) {
              return 1;
            } else {
              return 0;
            }
          });

          const sendFiltered = {
            ...filered[0],
            combineCard: dataSort,
          };

          setTimeout(() => {
            handleDetailType({
              data: sendFiltered,
              handleChange: (setSelected: any) => {
                handleNext({
                  objdata: setSelected,
                });
              },
            });
          }, 300);
        }
      }
    }
  }, [data]);

  const combaineSend = ({ card1, card2, item }: any) => {
    let casbackdata = null;
    const resultCasback = [...card1, ...card2];
    const resultStatus = resultCasback.filter(
      (itemCasback) => itemCasback.tag.cashback_status
    );
    casbackdata = resultStatus.length === 0 ? null : resultStatus;
    if (resultStatus.length === 2) {
      casbackdata = resultCasback.filter(
        (itemCasback: any) => itemCasback.type === "eSIM"
      );
    }

    let cardtype = null;
    let cardInitial = null;
    if (card2.length !== 0) {
      cardInitial = card2[0].initial_packet;
      cardtype = card2[0].typeID;
    }
    return {
      combineCard: resultCasback,
      intialCombine: [item.initial_packet, cardInitial],
      typeCombine: [item.typeID, cardtype],
      cashback: casbackdata,
    };
  };

  const handleNext = ({ objdata }: any) => {
    const obj = {
      id: objdata.id,
      serviceId: objdata.serviceId,
      name: objdata.name,
      price: objdata.price,
      before_price: objdata.before_price,
      kuota_double: objdata.kuota_double,
      day: objdata.day,
      cmid: objdata.cdmanid,
      kuota_utama: objdata.kuota_utama,
      kuota_full: objdata.kuota_full,
      total_kuota: objdata.total_kuota,
      length,
      type: objdata.type,
    };

    trakerEventAction(obj);
    if (objdata.type === "eSIM") {
      dispatch(setProductESim(obj));
      setModal(false);
      setObjData(obj);
      setOpenStopper(true);
      return;
    }

    dispatch(setProduct(obj));
    setSelectProduct(obj);
    if (localStorage.getItem("/pilih") == "true") {
      localStorage.setItem("/pilih", "false");
      router.push({
        pathname: "/detail-pesanan",
        query: {
          ...router?.query,
          paket: objdata.initial_packet,
        },
      });
    } else {
      router.push({
        pathname: "/layanan-pengiriman",
        query: {
          ...router?.query,
          paket: objdata.initial_packet,
        },
      });
    }
  };

  const trakerEventAction = (obj: any) => {
    addsPilihAction();
    layerEventGA3(
      router.pathname,
      `${obj.name} - ${obj.kuota_full} - ${obj.price.toString()} - ${obj.type}`
    );
    layerEventGA4({
      eventAction: "webstore_package",
      package_name: obj.name,
      package_size: obj.kuota_full,
      package_price: obj.price.toString(),
    });
    handleTraker({
      eventType: "select_item",
      productTrack: obj,
      typeTrack: obj.type,
    });
  };
  return (
    <LoadingError error={error} loading={loading}>
      <div className="mb-8">
        {data?.map((item: any, index: number, items: any) => (
          <div key={index} id={item.combineCard[0].initial_packet}>
            <Product
              item={item}
              data={item.combineCard[0]}
              dataCasback={item.cashback}
              selectProduct={selectProduct}
              setSelectProduct={setSelectProduct}
              handleChangeTraker={handleChangeTraker}
              handleChangeTrakerAll={handleChangeTrakerAll}
              index={index}
              length={items.length}
              handleNext={handleNext}
              handleDetail={handleDetail}
              handleDetailType={handleDetailType}
            />
          </div>
        ))}
      </div>
      <StopperESimInfo
        modal={openStopper}
        setModal={setOpenStopper}
        objdata={objData}
        setOpenDeviceList={setOpenDeviceList}
      />
      <DeviceDetail
        modal={openDeviceList}
        setModal={setOpenDeviceList}
      />
      <RateLimit
        modalRateLimit={modalRateLimit}
        setModalRateLimit={setModalRateLimit}
      />
      <StopperESimInfo
        modal={openStopper}
        setModal={setOpenStopper}
        objdata={objData}
        setOpenDeviceList={setOpenDeviceList}
      />
    </LoadingError>
  );
};

export default PilihDetail;
