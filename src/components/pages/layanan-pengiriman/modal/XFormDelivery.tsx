import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@components/templates/button/button";
import { IoCloseOutline } from "react-icons/io5";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ModalBottomSheet from "@components/global/modal/bottom-sheet";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import {
  setAddrProvince,
  setAddrCity,
  setAddrCityType,
  setAddrDistrict,
  setAddrSubDistrict,
  setAddrZipCode,
  setAddrDetailInfo,
} from "store/delivery/action";
import {
  getAddrProvince,
  getAddrCity,
  getAddrDistrict,
  getAddrSubDistrict,
} from "pages/api/narindo";
import ProgressStep from "@components/global/delivery-step/progressStep";
import { BiSearch } from "react-icons/bi";
import useToast from "src/hooks/useToast";
import { State } from "store/reducer";

interface FormDeliveryProps {
  openModal: boolean;
  setOpenModal: any;
  shippingAddress: any;
  setShippingAddress: any;
  setFilled: any;
  uuid: string;
}

const XFormDelivery = ({
  openModal,
  setOpenModal,
  shippingAddress,
  setShippingAddress,
  setFilled,
  uuid
}: FormDeliveryProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [modalclear, setModalClear] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [dataProvince, setDataProvince] = useState<any>([]);
  const [dataCity, setDataCity] = useState<any>({});
  const [dataDistrict, setDataDistrict] = useState<any>({});
  const [dataSubDistrict, setDataSubDistrict] = useState<any>({});
  const [search, setSearch] = useState<string>("");
  const [openDataIndex, setOpenDataIndex] = useState<number>(99);
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);
  const [filteredProvince, setFilteredProvince] = useState<any>([]);
  const addToast: any = useToast();

  const shippingArray = Object.keys(shippingAddress).map((key) => ({
    type:
      key === "province"
        ? "Provinsi"
        : key === "city"
          ? step !== 2
            ? ""
            : ""
          : key === "district"
            ? step == 3
              ? ""
              : "Kecamatan"
            : key === "subDistrict"
              ? step == 4
                ? ""
                : "Kelurahan"
              : key === "zipCode" && "Kode Pos",
    name: shippingAddress[key],
  }));

  const filteredArray: any = shippingArray.filter((item) => item.name !== "");

  useEffect(() => {
    fetchData();
  }, [
    shippingAddress.province,
    shippingAddress.city,
    shippingAddress.district,
    shippingAddress.subDistrict,
  ]);

  const fetchData = () => {
    setFilled(false);
    setStep(1);
    getDataProvince();
    if (
      shippingAddress.province !== "" &&
      shippingAddress.city === "Pilih Kota"
    ) {
      setStep(2);
      getDataCity(shippingAddress.province);
    }
    if (shippingAddress.city !== "" && shippingAddress.city !== "Pilih Kota") {
      setStep(3);
      getDataDistrict(
        shippingAddress.province,
        shippingAddress.city.split(" - ")[1],
        shippingAddress.city.split(" - ")[0]
      );
    }
    if (
      shippingAddress.district !== "" &&
      shippingAddress.city !== "Pilih Kota" &&
      shippingAddress.district !== "Pilih Kecamatan"
    ) {
      setStep(4);
      getDataSubDistrict(
        shippingAddress.province,
        shippingAddress.city.split(" - ")[1],
        shippingAddress.city.split(" - ")[0],
        shippingAddress.district
      );
    }
    if (shippingAddress.zipCode !== "") {
      setStep(6);
      setFilled(true);
    }
  };

  const getDataProvince = async () => {
    setLoading(true);
    const response = await getAddrProvince(uuid);

    if (response?.status == 200) {
      if (response.data.result.data.data.length == 0) {
        setErrorDetail("Data provinsi tidak ditemukan");
        setLoading(false);
      } else {
        let newdata = response?.data?.result?.data?.data.map(function (
          val: any,
          index: number,
        ) {
          return { text: val.province, type: "" };
        });

        setDataProvince(newdata);
        setLoading(false);
      }
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
    } else {
      setErrorDetail("Gagal memuat provinsi");
      setLoading(false);
    }
  };

  const getDataCity = async (c: string) => {
    setLoading(true);
    const response = await getAddrCity(c, uuid);

    if (response?.status == 200) {
      if (response.data.result.data.data.length == 0) {
        setErrorDetail("Data kota tidak ditemukan");
        setLoading(false);
      } else {
        let newdata = response?.data?.result?.data?.data.map(function (
          val: any,
          index: number
        ) {
          return { text: val.city, type: val.city_type };
        });
        setDataCity(newdata);
        setLoading(false);
      }
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
    } else {
      setErrorDetail("Gagal memuat kota");
      setLoading(false);
    }
  };

  const getDataDistrict = async (p: string, c: string, t: string) => {
    setLoading(true);
    const response = await getAddrDistrict(p, c, t, uuid);

    if (response?.status == 200) {
      if (response.data.result.data.data.length == 0) {
        setErrorDetail("Data kecamatan tidak ditemukan");
        setLoading(false);
      } else {
        let newdata = response?.data?.result?.data?.data.map(function (
          val: any,
          index: number
        ) {
          return { text: val.district, type: "" };
        });
        setDataDistrict(newdata);
        setLoading(false);
      }
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
    } else {
      setErrorDetail("Gagal memuat kacamatan");
      setLoading(false);
    }
  };

  const getDataSubDistrict = async (
    p: string,
    c: string,
    t: string,
    d: string
  ) => {
    setLoading(true);
    const response = await getAddrSubDistrict(p, c, t, d, uuid);

    if (response?.status == 200) {
      if (response.data.result.data.data.length == 0) {
        setErrorDetail("Data kelurahan tidak ditemukan");
        setLoading(false);
      } else {
        let newdata = response?.data?.result?.data?.data.map(function (
          val: any,
          index: number
        ) {
          return { text: val.village, code: val.postalcode };
        });
        setDataSubDistrict(newdata);
        setLoading(false);
      }
    } else if (response?.status == 403) {
      addToast(
        "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
      )
      setTimeout(() => router.push("/"), 2500);
    } else {
      setErrorDetail("Gagal memuat kelurahan");
      setLoading(false);
    }
  };

  const clearAddress = () => {
    setFilled(false);
    setShippingAddress({
      province: "",
      city: "",
      district: "",
      subDistrict: "",
      zipCode: "",
    });
    setErrorDetail("");
    dispatch(setAddrProvince(""));
    dispatch(setAddrCity(""));
    dispatch(setAddrCityType(""));
    dispatch(setAddrDistrict(""));
    dispatch(setAddrSubDistrict(""));
    dispatch(setAddrZipCode(""));
    setResetConfirm(false);
  };

  const handleBack = () => setResetConfirm(false);

  const selectRegionHandler = (condition: string, data: any) => {
    switch (condition) {
      case "province":
        setShippingAddress({
          ...shippingAddress,
          province: data.text,
          city: "Pilih Kota",
          district: "",
          subDistrict: "",
          zipCode: "",
        });
        setOpenDataIndex(99);
        break;
      case "city":
        setShippingAddress({
          ...shippingAddress,
          city: data.type + " - " + data.text,
          district: "Pilih Kecamatan",
          subDistrict: "",
          zipCode: "",
        });
        setOpenDataIndex(99);
        break;
      case "district":
        setShippingAddress({
          ...shippingAddress,
          district: data.text,
          subDistrict: "Pilih Kelurahan",
          zipCode: "",
        });
        setOpenDataIndex(99);
        break;
      case "subDistrict":
        setShippingAddress({
          ...shippingAddress,
          subDistrict: data.text,
          zipCode: data.code,
        });
        setOpenDataIndex(99);
        dispatch(setAddrProvince(shippingAddress.province));
        dispatch(setAddrCity(shippingAddress.city.split(" - ")[1]));
        dispatch(setAddrCityType(shippingAddress.city.split(" - ")[0]));
        dispatch(setAddrDistrict(shippingAddress.district));
        dispatch(setAddrSubDistrict(data.text));
        dispatch(setAddrZipCode(data.code));
        break;
      default:
        setShippingAddress({
          province: "",
          city: "",
          district: "",
          subDistrict: "",
          zipCode: "",
        });
        setOpenDataIndex(99);
    }
  };

  const openDataIndexHandler = (index: number) => {
    setOpenDataIndex(index);
    setErrorDetail("");
  };

  const onClose = () => {
    setOpenModal(false);
    setErrorDetail("");
  };

  const handleSearch = () => {
    const filtered = dataProvince.filter((data: any) => {
      return data.text.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredProvince(filtered);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <>
      <ModalBottomSheet
        modal={openModal}
        setModal={onClose}
        title="Pilih Wilayah"
        scrollContent
        classNameBtn="text-md font-Museo-Bold uppercase tracking-wides"
        className={
          resetConfirm
            ? "wrapper-delivery"
            : "wrapper-delivery wrapper-delivery-auto"
        }
        onClickAction={
          shippingAddress.zipCode !== "" &&
          !resetConfirm && {
            label: "Pilih",
            action: () => {
              handleSubmit();
            },
          }
        }
      >
        {!resetConfirm ? (
          <div className="component-wrapp">
            <div className="wrapper-content scroll-content flex flex-col justify-between relative h-full">
              <div className="body">
                <div className="flex justify-between">
                  <ProgressStep
                    props={filteredArray}
                    step={step}
                    openDataIndexHandler={openDataIndexHandler}
                  />
                  <div
                    className={`font-Museo-Medium text-sm text-biruxl hover:cursor-pointer ${shippingAddress.province !== "" ? "block" : "hidden"
                      }`}
                    onClick={() => setResetConfirm(true)}
                  >
                    Atur Ulang
                  </div>
                </div>

                <ul className="list-provinces">
                  {step == 1 || openDataIndex == 0 ? (
                    <>
                      <div className="font-Museo md:text-md text-sm mb-4">
                        Provinsi
                      </div>
                      <div className="flex gap-3 items-center border border-light-gray rounded-3xl p-2 mb-3">
                        <BiSearch size={18} className="text-deep-gray" />
                        <input
                          type="text"
                          id="province"
                          name="province"
                          value={search}
                          placeholder="Cari nama provinsi"
                          onChange={(e) => setSearch(e.target.value)}
                          className="focus:outline-none w-full outline-none text-Axiata-Book"
                        />
                      </div>
                      {loading ? (
                        <div className="font-Museo-Italic font-xs text-deep-gray">
                          Loading...
                        </div>
                      ) : errorDetail ? (
                        <div className="font-Museo-Medium text-xl-warning text-sm">
                          {errorDetail}
                        </div>
                      ) : (
                        dataProvince?.length &&
                        dataProvince
                          ?.filter((item: any) => {
                            return search.toLocaleLowerCase() === ""
                              ? item
                              : item.text.toLowerCase().includes(search);
                          })
                          .map((item: any, i: number) => (
                            <li
                              key={i}
                              className="py-1 hover:cursor-pointer"
                              onClick={() =>
                                selectRegionHandler("province", item)
                              }
                            >
                              <div className="flex gap-2 hover:bg-gray-100 items-center">
                                <div>
                                  <GrLocation size={16} />
                                </div>
                                <div className="font-Axiata-Medium text-sm">
                                  {item.text}
                                </div>
                              </div>
                            </li>
                          ))
                      )}
                    </>
                  ) : step == 2 || openDataIndex == 1 ? (
                    <>
                      <div className="font-Museo md:text-md text-sm mb-4">
                        Kota
                      </div>
                      {loading ? (
                        <div className="font-Museo-Italic font-xs text-deep-gray">
                          Loading...
                        </div>
                      ) : errorDetail ? (
                        <div className="font-Museo-Medium text-xl-warning text-sm">
                          {errorDetail}
                        </div>
                      ) : (
                        dataCity?.length &&
                        dataCity.map((el: any, i: number) => (
                          <li
                            key={i}
                            className="py-1 hover:cursor-pointer"
                            onClick={() => selectRegionHandler("city", el)}
                          >
                            <div className="flex gap-2 hover:bg-gray-100 items-center">
                              <div>
                                <GrLocation size={16} />
                              </div>
                              <div className="font-Museo-Medium text-sm">
                                {el.type} {el.text}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </>
                  ) : step == 3 || openDataIndex == 2 ? (
                    <>
                      <div className="font-Museo md:text-md text-sm mb-4">
                        Kecamatan
                      </div>
                      {loading ? (
                        <div className="font-Museo-Italic font-xs text-deep-gray">
                          Loading...
                        </div>
                      ) : errorDetail ? (
                        <div className="font-Museo-Medium text-xl-warning text-sm">
                          {errorDetail}
                        </div>
                      ) : (
                        dataDistrict?.length &&
                        dataDistrict.map((el: any, i: number) => (
                          <li
                            key={i}
                            className="py-1 hover:cursor-pointer"
                            onClick={() => selectRegionHandler("district", el)}
                          >
                            <div className="flex gap-2 hover:bg-gray-100 items-center">
                              <div>
                                <GrLocation size={16} />
                              </div>
                              <div className="font-Museo-Medium text-sm">
                                {el.text}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </>
                  ) : (shippingAddress.subDistrict === "Pilih Kelurahan" &&
                    step == 4) ||
                    openDataIndex == 3 ? (
                    <>
                      <div className="font-Museo md:text-md text-sm mb-4">
                        Kelurahan
                      </div>
                      {loading ? (
                        <div className="font-Museo-Italic font-xs text-deep-gray">
                          Loading...
                        </div>
                      ) : errorDetail ? (
                        <div className="font-Museo-Medium text-xl-warning text-sm">
                          {errorDetail}
                        </div>
                      ) : (
                        dataSubDistrict?.length &&
                        dataSubDistrict.map((el: any, i: number) => (
                          <li
                            key={i}
                            className="py-1 hover:cursor-pointer"
                            onClick={() =>
                              selectRegionHandler("subDistrict", el)
                            }
                          >
                            <div className="flex gap-2 hover:bg-gray-100 items-center">
                              <div>
                                <GrLocation size={16} />
                              </div>
                              <div className="font-Museo-Medium text-sm">
                                {el.text}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-0 flex flex-col items-center justify-center text-center h-full">
            <div className="flex flex-col items-center justify-between">
              <div className="body flex flex-col items-center justify-center">
                <Image
                  src="/esim/reserved_failed.svg"
                  width={96.31}
                  height={103.79}
                  alt="Question"
                />
                <div className="font-Museo-Bold md:text-xl text-lg tracking-wider text-center md:mt-10 mb-4">
                  Apakah Anda ingin menghapus informasi lokasi ini?
                </div>
                <div className="font-Museo-Light md:text-md text-sm text-center mb-4">
                  Jika dihapus, maka seluruh lokasi yang sudah terisi dibawahnya
                  akan ikut hilang{" "}
                </div>
              </div>
              <div className="button-c w-full mt-8">
                <Button
                  variant="axis"
                  type="secondary"
                  className="button-container my-2 btn-no-hover"
                  rounded
                  onClick={clearAddress}
                >
                  <div className="flex justify-center items-center font-Museo">
                    <span className="button-text">Ya Hapus</span>
                  </div>
                </Button>
                <Button
                  variant="axis"
                  className="button-container my-2"
                  rounded
                  onClick={handleBack}
                >
                  <div className="flex justify-center items-center text-white font-Museo">
                    <span className="button-text">Tidak Hapus</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalBottomSheet>
    </>
  );
};

export default XFormDelivery;
