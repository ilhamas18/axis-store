import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@components/templates/button/button";
import Delivery from "./delivery";
import Total from "@components/global/total";
import Radio from "@mui/material/Radio";
import Image from "next/image";
import { priceNumber } from "@components/global/mixins";
import { useDispatch } from "react-redux";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { getServiceRate } from "pages/api/narindo";
import { setCourier } from "store/delivery/action";
import SEO from "@components/global/seo";
import { isEmptyObj } from "@components/global/mixins";
import { setAddrDetailInfo } from "store/delivery/action";

import {
  addsLayananPengirimanLand,
  addsLayananPengirimanAction,
} from "src/data-layer/adds";
import ModalBottomSheet from "@components/global/modal/bottom-sheet";
import useToast from "src/hooks/useToast";

const serviceOrder = ["ECONOMICAL", "REGULER", "NEXT_DAY"];

const DeliveryServiceB = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { delivery, product, uuid } = useSelector(
    (state: State) => ({
      delivery: state.delivery,
      product: state.product.product,
      uuid: state.uuid.uuid
    }),
    shallowEqual
  );

  const [solved, setSolved] = useState<any>(false);
  const [isModalCourier, setModalCourier] = useState<boolean>(false);
  const [loadingCourier, setLoadingCourier] = useState<boolean>(false);
  const [listCourier, setCourierListData] = useState<Array<String>>([]);
  const [address, setAddress] = useState<string>(
    delivery.detail?.detail !== "" ? delivery.detail?.detail : ""
  );
  const [information, setInformation] = useState<string>(
    delivery.detail?.info !== "" ? delivery.detail?.info : ""
  );
  const [activeCourierData, setactiveCourierData] = useState<{
    id: Record<string, any>;
    idSelected: boolean;
    all: any[];
  }>({
    id: {},
    idSelected: false,
    all: [],
  });
  const [errorSR, setErrorSR] = useState<boolean>(false);
  const addToast: any = useToast();

  const handleTraker = () => {
    let dicount =
      typeof product.before_price !== "undefined" ? product.before_price : 0;
    let price = typeof product.price !== "undefined" ? product.price : 0;
    let dicountPrice = dicount - price;
    if (dicount === 0) {
      dicountPrice = 0;
    }
    let dicountPriceItem = dicount - dicountPrice;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_shipping_info",
      ecommerce: {
        currency: "IDR",
        value: dicountPriceItem,
        coupon: "None",
        shipping_tier: `${delivery.courier.name} ${delivery.courier.group}`,
        items: [
          {
            item_id: product.serviceId,
            item_name: `${product.name} ${product.kuota_full}`,
            affiliation: "AXIS",
            currency: "IDR",
            discount: dicountPrice,
            index: product.index,
            item_brand: "AXIS",
            item_category: `${product.name}`,
            item_category2: `${product.name} - ${product.type}`,
            item_list_id: "pilih_paket_kamu",
            item_list_name: "Pilih Paket Kamu",
            item_variant: product.kuota_full,
            price: dicount,
            quantity: 1,
          },
        ],
      },
    });
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    dispatch(setAddrDetailInfo({ detail: address, info: information }));
    handleTraker();
    addsLayananPengirimanAction();
    if (localStorage.getItem("/layanan-pengiriman") == "true") {
      localStorage.setItem("/layanan-pengiriman", "false");
      router.push({
        pathname: "/detail-pesanan",
        query: {
          ...router?.query,
        },
      });
    } else {
      router.push({
        pathname: "/registrasi",
        query: {
          ...router?.query,
        },
      });
    }
  };

  const getServiceRateData = async (
    rp: number,
    province: string,
    city_type: string,
    city: string,
    district: string,
    village: string,
    postal_code: string,
    address_detail: string
  ) => {
    setLoadingCourier(true);

    const response = await getServiceRate(
      product?.serviceId,
      rp,
      province,
      city,
      city_type,
      district,
      village,
      postal_code,
      address_detail,
      uuid
    );

    if (response?.status == 200) {
      let dataResponse;
      if (Object.keys(response?.data?.result?.data?.data).length) {
        dataResponse = response?.data?.result?.data?.data;
      } else {
        dataResponse = response?.data?.data;
      }

      if (dataResponse?.logistics?.length < 1) {
        setLoadingCourier(false);
        setErrorSR(true);
      } else {
        let res = dataResponse?.logistics;
        const filter = res?.filter((item: any) => {
          return item?.services?.length != 0;
        });

        const combinedServicesFirst: any = [];
        filter.forEach((courier: any) => {
          courier.services.forEach((service: any) => {
            combinedServicesFirst.push({
              ...service,
              courier_code: courier.courier_code,
              biggerSend: Number(service.etd.match(/\d+/g)[1]) || 0,
              flat_ongkir: service.total_fee < service.rates,
              alias_name: service.service_group
                ?.replace("REGULER", "Regular")
                ?.replace("NEXT_DAY", "Instan")
                ?.replace("ECONOMICAL", "Ekonomi"),
              alias_etd: service.etd
                ?.replace("hari", "Hari")
                ?.replace("Day", "Hari")
                ?.replace("days", "Hari")
                ?.replace("0 hari pengiriman", ""),
            });
          });
        });
        const combinedServices: any = [];
        combinedServicesFirst.forEach((service: any) => {
          combinedServices.push({
            ...service,
            flat_ongkir_group:
              combinedServicesFirst.filter(
                (e: any) =>
                  e.service_group === service.service_group && e.flat_ongkir
              ).length > 0,
          });
        });
        let combinedServiceData: any = combinedServices;

        const maxNumbers: Record<string, number> = {};
        combinedServiceData.forEach((item: any) => {
          const { biggerSend, service_group } = item;
          if (
            !maxNumbers[service_group] ||
            biggerSend > maxNumbers[service_group]
          ) {
            maxNumbers[service_group] = biggerSend;
          }
        });

        combinedServiceData.filter((item: any) => {
          const { biggerSend, service_group } = item;

          return biggerSend === maxNumbers[service_group];
        });

        const combinedServiceDataFiltered = combinedServiceData.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex((t: any) => t.service_group === value.service_group)
        );

        const sortIndexMap: Record<string, number> = {};
        serviceOrder.forEach((item, index) => {
          sortIndexMap[item] = index;
        });

        const customCompare = (a: any, b: any) => {
          const indexA = sortIndexMap[a.service_group];
          const indexB = sortIndexMap[b.service_group];
          return indexA - indexB;
        };
        combinedServiceData = combinedServiceDataFiltered.sort(customCompare);

        let idSelected = false;
        let combinedServiceDataId = combinedServiceData[0];
        if (!isEmptyObj(delivery.courier)) {
          idSelected = combinedServiceData.filter(
            (filter: any) => filter.service_code === delivery.courier.code
          );
          combinedServiceDataId = combinedServices.filter(
            (item: any) =>
              item.courier_code === delivery.courier.name &&
              item.service_code === delivery.courier.code
          )[0];
        }

        idSelected =
          combinedServices.filter(
            (e: any) =>
              e.flat_ongkir &&
              combinedServiceDataId.service_group === e.service_group
          ).length > 0;
        setCourierListData(combinedServices);
        setactiveCourierData({
          idSelected,
          id: combinedServiceDataId,
          all: combinedServiceData,
        });

        setLoadingCourier(false);
        setErrorSR(false);
      }
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
    } else {
      setLoadingCourier(false);
      setErrorSR(true);
    }
  };

  const handleEkspedisi = (item: any) => {
    dispatch(
      setCourier({
        name: item.courier_code,
        group: item.service_name?.replace("Anteraja", "")?.replace("_", " "),
        code: item.service_code,
        price: item.total_fee,
        est: item.etd,
        alias_name: item.alias_name,
        // couriers: sortedArray,
      })
    );
  };
  useEffect(() => {
    if (
      delivery?.province &&
      delivery?.city &&
      delivery?.cityType &&
      delivery?.district &&
      delivery?.subdistrict &&
      delivery?.zipcode
    ) {
      getServiceRateData(
        product?.price,
        delivery?.province,
        delivery?.city,
        delivery?.cityType,
        delivery?.district,
        delivery?.subdistrict,
        delivery?.zipcode,
        delivery?.detail?.detail ?? "detail"
      );
    }
  }, [dispatch, delivery?.subdistrict, delivery?.zipcode, errorSR]);

  useEffect(() => {
    addsLayananPengirimanLand();
  }, []);

  return (
    <div className="container pb-8">
      <SEO title={"Layanan Pengiriman"} />
      <form onSubmit={handleSubmit}>
        <div className="body">
          <div className="px-4">
            <div className="title font-Museo-Bold md:text-2xl text-lg tracking-wider mt-4">
              Pilih Pengiriman
            </div>
            <div className="subtitle font-Museo-Medium md:text-md text-sm mt-2">
              Isi alamat/lokasi kamu
            </div>
            {/* <DeliveryForm solved={solved} setSolved={setSolved} /> */}
            <Delivery
              delivery={delivery}
              isFilled={solved}
              setIsFilled={setSolved}
              address={address}
              setAddress={setAddress}
              information={information}
              setInformation={setInformation}
              uuid={uuid}
            />
            <div className="px-4 py-6 mt-6 bg-light-blue flex flex-row items-center rounded-[12px] mb-4">
              <div>
                <RiErrorWarningLine size={23} style={{ color: "#6F2B90" }} />
              </div>
              <div className="ml-4">
                <div className="font-Museo-Light md:text-md tracking-wider text-sm">
                  Untuk dapat melanjutkan proses, kamu wajib mengisi semua
                  informasi seperti provinsi, kota, kecamatan, kelurahan, kode
                  pos, hingga alamat lengkap secara berurutan
                </div>
              </div>
            </div>
          </div>
        </div>

        {delivery?.zipcode && !loadingCourier && !errorSR && (
          <div className="pb-9">
            <div className="px-4">
              <h2 className="pt-4 mb-3 font-Museo-Bold text-lg">
                Metode Pengiriman
              </h2>
              <div className="mt-2">
                <div
                  className={`cursor-pointer py-3 px-4 border-
                    [#6E2C91] w-full text-white rounded-t-lg bg-[#6E2C91]`}
                  onClick={() => setModalCourier(true)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="opacity-[0.7] font-Museo-Light uppercase text-xs">
                        Pilih pengiriman
                      </p>
                      <div className="font-Museo-Bold text-lg">
                        {activeCourierData.id.alias_name}
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold px-4 py-1 bg-white text-[#6E2C91] w-[max-content] rounded-[20px]">
                      GANTI
                    </div>
                  </div>
                  {activeCourierData.idSelected && (
                    <div className="px-3 py-1 mt-2 border-[1px] border-light-gray flex flex-row items-center rounded-[6px]">
                      <div>
                        <Image
                          src={`/icons/ic_note_white.svg`}
                          width={15}
                          height={15}
                          alt="expedisi card"
                        />
                      </div>
                      <div className="ml-2">
                        <div className="font-Museo-Light md:text-md tracking-wider text-sm">
                          Flat Ongkir, jauh dekat harga tetap sama
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-light-gray h-full border-b-2 border-l-2 border-r-2 rounded-b-lg">
                  {listCourier
                    ?.filter(
                      (val: any) =>
                        val.service_group === activeCourierData.id.service_group
                    )
                    .map((item: any, index: number, row: any) => (
                      <div
                        className={`${row.length - 1 === index
                          ? ""
                          : "border-b-2 border-light-gray"
                          } py-3 pl-4 pr-3
                        `}
                        key={index}
                      >
                        <div className="content flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="image flex items-center">
                              <Image
                                src={`/icons/couriers/${item.courier_code.toLowerCase()}.png`}
                                width={30}
                                height={30}
                                alt={item.courier_code}
                              />
                            </div>

                            <div className="ml-4 font-Museo text-md">
                              <div className="flex items-center uppercase">
                                <div className="font-Museo-Bold text-xl">
                                  {item.courier_code}
                                </div>
                                {item.flat_ongkir && (
                                  <div className="ml-2 w-[fit-content] px-1 py-[1px] bg-orange-300 rounded-[3px] justify-center items-center flex">
                                    <div className="font-light text-[12px] uppercase px-1">
                                      FLAT ONGKIR
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-slate-500 flex items-center">
                                {item.alias_etd} - {priceNumber(item.total_fee)}{" "}
                                {item.flat_ongkir && (
                                  <div className="font-Museo-Light text-xs line-through text-deep-gray ml-2">
                                    {priceNumber(item.rates)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="checkbox">
                            <Radio
                              id="courier"
                              value={item.service_code}
                              checked={
                                delivery?.courier.code != item.service_code
                                  ? false
                                  : true
                              }
                              onClick={() => {
                                handleEkspedisi(item);
                              }}
                              sx={{
                                color: "#999",
                                "&.Mui-checked": {
                                  color: "#00E2BC",
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {loadingCourier && (
          <div className="border-b-4 border-light-gray py-3">
            <div className="px-4">
              <h3 className="mt-3 font-Museo-Bold text-lg min-h-[25px] w-32 bg-slate-300 animate-pulse"></h3>
              <div className="list-courier my-5">
                <div className="card-courier">
                  <div className="content">
                    <div className="image">
                      <div className="rounded-full min-h-[30px] min-w-[30px] animate-pulse bg-slate-300"></div>
                    </div>
                    <div className="ml-4 font-Museo text-md w-4/5">
                      <div className="font-Museo-Bold animate-pulse bg-slate-300 min-h-[20px] w-40"></div>
                      <div className="text-sm bg-slate-300 animate-pulse min-h-[10px] w-20 mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorSR && delivery?.zipcode && (
          <div className="flex gap-2 p-5">
            <div className="md:w-1/3 w-1/2  flex justify-center">
              <Image
                src="/icons/courier-error.png"
                width={90}
                height={90}
                alt="Error"
              />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-xl font-Museo-Bold">
                Gagal memuat data ekspedisi
              </h3>
              <button
                className="my-2"
                onClick={() => {
                  setErrorSR(false);
                }}
              >
                <span className="text-biruxl cursor-pointer text-sm">Coba lagi</span>
              </button>
            </div>
          </div>
        )}
        <Total>
          <Button
            variant="axis"
            className="button-container"
            rounded
            disabled={
              !solved ||
                Object.keys(delivery?.courier)?.length == 0 ||
                address === ""
                ? true
                : false
            }
          >
            <div className="flex justify-center items-center font-Museo-Medium text-white">
              <span className="button-text tracking-widest">LANJUT</span>
            </div>
          </Button>
        </Total>
      </form>
      {isModalCourier && (
        <ModalBottomSheet
          modal={isModalCourier}
          setModal={setModalCourier}
          className="wrapper-pilih-delivery wrapper-pilih-courier"
          title="Pilih Pengiriman"
        >
          {activeCourierData.all.map(
            (itemsub: any, index: number, row: any) => (
              <div
                className={`${index + 1 === row.length
                  ? ""
                  : "border-1 border-b border-light-gray"
                  } flex justify-between items-center py-3`}
                key={index}
              >
                <div className="font-Museo text-md flex justify-between items-center w-full">
                  <div>
                    <div className="flex items-center">
                      <span className="font-Museo-Bold">
                        {itemsub.alias_name}
                      </span>
                      {itemsub.flat_ongkir_group && (
                        <div className="ml-2 w-[fit-content] px-1 py-[1px] bg-orange-300 rounded-[3px] justify-center items-center flex">
                          <div className="font-light text-[12px] uppercase px-1">
                            FLAT ONGKIR
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      Pengiriman Dalam{" "}
                      {itemsub.alias_etd === "1-1 Hari"
                        ? "1 Hari"
                        : itemsub.alias_etd}
                    </span>
                  </div>
                  <div className="checkbox">
                    <Radio
                      id="courier_modal"
                      value={itemsub}
                      checked={
                        activeCourierData.id.service_group !=
                          itemsub.service_group
                          ? false
                          : true
                      }
                      onClick={() => {
                        setactiveCourierData({
                          ...activeCourierData,
                          idSelected: itemsub.flat_ongkir_group,
                          id: activeCourierData.all.filter(
                            (item) =>
                              item.service_code === itemsub.service_code &&
                              item.courier_code === itemsub.courier_code
                          )[0],
                        });
                        dispatch(setCourier({}));
                        setModalCourier(false);
                      }}
                      sx={{
                        color: "#999",
                        "&.Mui-checked": {
                          color: "#00E2BC",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </ModalBottomSheet>
      )}
    </div>
  );
};

export default DeliveryServiceB;
