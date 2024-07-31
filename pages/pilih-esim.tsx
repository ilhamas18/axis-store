import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  setNumber,
  setListNumber,
  setMinPage,
  setMaxPage,
} from "../store/msisdn/action";
import NumberList from "@components/pages/feature/Pilih/esim/msisdn-list";
import { setTablePage } from "store/table/action";
import { State } from "store/reducer";
import { layerEventGA4 } from "src/data-layer";
import Searchbar from "@components/pages/feature/Pilih/esim/searchbar";
import IconWaiting from "@components/global/loading/loading";
import NotFound from "@components/pages/feature/Pilih/esim/notFound";
import { getData, getDataFilter } from "./api/esim";
import SEO from "@components/global/seo";
import RateLimit from "@components/global/modal/rate-limit";
import XFilter from "@components/pages/feature/Pilih/esim/modal/x-filter";
import { FaFilter } from "react-icons/fa";
import useToast from "src/hooks/useToast";

const PilihEsim = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { number, listNumber, tablePage, changeNumber, selected } = useSelector(
    (state: State) => ({
      number: state.msisdn.number,
      listNumber: state.msisdn.listNumber,
      tablePage: state.table.tablePage,
      changeNumber: state.payload.changeNumber,
      selected: state.payload.selected,
    }),
    shallowEqual
  );

  const [type, setType] = useState<number>(0);
  const [pattern, setPattern] = useState<string>("");
  const [warning, setWarning] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [onNextGetNumber, setOnNextGetNumber] = useState<boolean>(false);
  const [isOnSearch, setIsOnSearch] = useState(false);
  const [rechangeNumber, setRechangeNumber] = useState<string>("");
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [category, setCategory] = useState<any>({
    typeBerurut: "false",
    typeBerulang: "false",
    // typeMajumapan: "false",
    semua: "false",
  });
  const [rangePrice, setRangePrice] = useState<any>({
    categori1: "false",
    categori2: "false",
    categori3: "false",
    categori4: "false",
    categori5: "false",
    categori6: "false",
    semua: "false",
  });
  const addToast: any = useToast();

  const lengthPage = listNumber?.length;

  useEffect(() => {
    fetchNumber();
    dispatch(setMinPage(1));
    dispatch(setMaxPage(4));
    setPage(1);

    if (selected.length) {
      const decrypted = selected;
      const output = "0" + decrypted?.substring(2, decrypted.length);
      setRechangeNumber(output);
    }
  }, [pattern, dispatch, type]);

  useEffect(() => {
    router.push({
      pathname: "/pilih-esim",
      query: {
        ...router?.query,
      },
    });
    removeQueryParam("msisdn");
  }, []);

  const fetchNumber = async () => {
    dispatch(setListNumber([]));
    dispatch(setNumber([]));
    setLoading(true);

    if (type == 99) {
      try {
        const payload = {
          page: tablePage,
          pattern: pattern.toString(),
        };

        const response = await getDataFilter(payload);

        if (response.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (response?.status == 429) {
          overLimit();
        } else if (response.status == 200) {
          if (response.data.result.data.length) {
            dispatch(setListNumber(response.data.result.data));
            dispatch(setNumber(response.data.result.data[page - 1].msisdnList));
            dispatch(setTablePage(tablePage + 1));
            setIsNotFound(false);
          } else {
            setIsNotFound(true);
          }
          setLoading(false);
        } else {
          dispatch(setNumber([]));
          dispatch(setListNumber([]));
          setIsNotFound(true);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setWarning("Koneksi bermasalah. Silakan tunggu beberapa saat lagi");
      }
    }

    if (type == 0) {
      try {
        const payload = {
          type: "reguler",
          page: tablePage,
          pattern: pattern.toString(),
        };
        const response = await getData(payload);

        if (response.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (response?.status == 429) {
          overLimit();
        } else if (response.status == 200) {
          if (response.data.result.data.length) {
            dispatch(setListNumber(response.data.result.data));
            dispatch(setNumber(response.data.result.data[page - 1].msisdnList));
            dispatch(setTablePage(tablePage + 1));
            setIsNotFound(false);
          }
          setLoading(false);
        } else {
          dispatch(setNumber([]));
          dispatch(setListNumber([]));
          setIsNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setWarning("Koneksi bermasalah. Silakan tunggu beberapa saat lagi");
      }
    }

    if (type == 1) {
      try {
        const payload = {
          type: "premium",
          page: tablePage,
          pattern: pattern.toString(),
        };
        const response = await getData(payload);

        if (response.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (response?.status == 429) {
          overLimit();
        } else if (response.status == 200) {
          if (response.data.result.data.length) {
            dispatch(setListNumber(response.data.result.data));
            dispatch(setNumber(response.data.result.data[page - 1].msisdnList));
            dispatch(setTablePage(tablePage + 1));
            setIsNotFound(false);
          } else {
            setIsNotFound(true);
          }
          setLoading(false);
        } else {
          dispatch(setNumber([]));
          dispatch(setListNumber([]));
          setIsNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setWarning("Koneksi bermasalah. Silakan tunggu beberapa saat lagi");
      }
    }

    if (type == 2) {
      try {
        const payload = {
          type: "premium",
          page: tablePage,
          pattern: pattern.toString(),
          typeBerurut: category.typeBerurut,
          typeBerulang: category.typeBerulang,
          typeMajumapan: category.typeMajumapan,
          categori1: rangePrice.categori1,
          categori2: rangePrice.categori2,
          categori3: rangePrice.categori3,
          categori4: rangePrice.categori4,
          categori5: rangePrice.categori5,
          categori6: rangePrice.categori6,
        };

        const response = await getDataFilter(payload);

        if (response.status == 403) {
          addToast(
            "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
          )
          setTimeout(() => router.push("/"), 2500);
        } else if (response?.status == 429) {
          overLimit();
        } else if (response.status == 200) {
          if (response.data.result.data.length) {
            dispatch(setListNumber(response.data.result.data));
            dispatch(setNumber(response.data.result.data[page - 1].msisdnList));
            dispatch(setTablePage(tablePage + 1));
            setIsNotFound(false);
          } else {
            setIsNotFound(true);
          }
          setLoading(false);
        } else {
          dispatch(setNumber([]));
          dispatch(setListNumber([]));
          setIsNotFound(true);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setWarning("Koneksi bermasalah. Silakan tunggu beberapa saat lagi");
      }
    }
  };

  const tabSelectionReguler = () => {
    setPattern('');
    if (type == 0) tabSelected(99);
    else tabSelected(0);
    resetFilter();
    layerEventGA4({
      eventAction: "select_content",
      content_id: "interaction",
      content_type: "Button Click",
      content_name: "Cantik",
      content_section: "Body Page",
    });
  };

  const tabSelectionPremium = () => {
    setPattern('');
    if (type == 1) tabSelected(99);
    else tabSelected(1);
    resetFilter();
    layerEventGA4({
      eventAction: "select_content",
      content_id: "interaction",
      content_type: "Button Click",
      content_name: "Cantik Banget",
      content_section: "Body Page",
    });
  };

  const removeQueryParam = (param: any) => {
    const updatedQuery = router?.query;
    delete updatedQuery[param];

    router.push({ query: updatedQuery }, undefined, { shallow: false });
  };

  const tabSelected = (type: number) => {
    setType(type);
    setLoading(true);
    dispatch(setListNumber([]));
    dispatch(setNumber([]));

    dispatch(setMinPage(1));
    dispatch(setMaxPage(4));
    dispatch(setTablePage(1));
    setIsOnSearch(false);
    setPattern("");
    router.push({
      pathname: "/pilih-esim",
      query: {
        ...router?.query,
      },
    });
    removeQueryParam("msisdn");
  };

  const resetFilter = () => {
    setPattern("");
    setCategory({
      ...category,
      typeBerurut: "false",
      typeBerulang: "false",
      typeMajumapan: "false",
      semua: "false",
    });
    setRangePrice({
      ...rangePrice,
      categori1: "false",
      categori2: "false",
      categori3: "false",
      categori4: "false",
      categori5: "false",
      categori6: "false",
      semua: "false",
    });
  };

  const fillterPattern = (num: any) => {
    dispatch(setNumber([]));
    dispatch(setListNumber([]));

    dispatch(setMinPage(1));
    dispatch(setMaxPage(4));
    dispatch(setTablePage(1));
    setPattern(num);
    setPageHandler(1);
  };

  const setPageHandler = async (val: number) => {
    setPage(val);
    try {
      dispatch(setNumber(listNumber[val - 1].msisdnList));
    } catch (err) {
      setLoading(true);
      if (onNextGetNumber) {
        try {
          if (type == 99) {
            const payload = {
              page: tablePage,
              pattern: pattern.toString(),
            };
            const response = await getDataFilter(payload);

            if (response.status == 403) {
              addToast(
                "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
              )
              setTimeout(() => router.push("/"), 2500);
            } else if (response?.status == 429) {
              overLimit();
            } else if (response.status == 200) {
              let temp = [];
              temp.push(...listNumber, ...response.data.result.data);

              dispatch(setListNumber(temp));
              dispatch(setNumber(listNumber[page - 1].msisdnList));
              dispatch(setTablePage(tablePage + 1));
              setLoading(false);
            } else {
              overLimit();
            }
          } else if (type == 0) {
            const payload = {
              type: "reguler",
              page: tablePage,
              pattern: pattern.toString(),
            };
            const response = await getData(payload);

            if (response.status == 403) {
              addToast(
                "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
              )
              setTimeout(() => router.push("/"), 2500);
            } else if (response?.status == 429) {
              overLimit();
            } else if (response.status == 200) {
              let temp = [];
              temp.push(...listNumber, ...response.data.result.data);

              dispatch(setListNumber(temp));
              dispatch(setNumber(listNumber[page - 1].msisdnList));
              dispatch(setTablePage(tablePage + 1));
              setLoading(false);
            } else {
              overLimit();
            }
          } else if (type == 1) {
            const payload = {
              type: "premium",
              page: tablePage,
              pattern: pattern.toString(),
            };
            const response = await getData(payload);

            if (response.status == 403) {
              addToast(
                "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
              )
              setTimeout(() => router.push("/"), 2500);
            } else if (response?.status == 429) {
              overLimit();
            } else if (response.status == 200) {
              let temp = [];
              temp.push(...listNumber, ...response.data.result.data);

              dispatch(setListNumber(temp));
              dispatch(setNumber(listNumber[page - 1].msisdnList));
              dispatch(setTablePage(tablePage + 1));
              setLoading(false);
            } else {
              overLimit();
            }
          } else if (type == 2) {
            const payload = {
              type: "premium",
              page: tablePage,
              pattern: pattern.toString(),
              typeBerurut: category.typeBerurut,
              typeBerulang: category.typeBerulang,
              typeMajumapan: category.typeMajumapan,
              categori1: rangePrice.categori1,
              categori2: rangePrice.categori2,
              categori3: rangePrice.categori3,
              categori4: rangePrice.categori4,
              categori5: rangePrice.categori5,
              categori6: rangePrice.categori6,
            };
            const response = await getDataFilter(payload);

            if (response.status == 403) {
              addToast(
                "Sesimu telah berakhir untuk menjaga keamanan akun. Ulangi kembali proses kamu"
              )
              setTimeout(() => router.push("/"), 2500);
            } else if (response?.status == 429) {
              overLimit();
            } else if (response?.status == 200) {
              let temp = [];
              temp.push(...listNumber, ...response.data.result.data);

              dispatch(setListNumber(temp));
              dispatch(setNumber(listNumber[page - 1].msisdnList));
              dispatch(setTablePage(tablePage + 1));
              setLoading(false);
            } else {
              overLimit();
            }
          }
        } catch (err) {
          overLimit();
        }
      } else setLoading(false);
    }
  };

  const overLimit = () => {
    setPageHandler(1);
    dispatch(setNumber([]));
    dispatch(setListNumber([]));

    dispatch(setMinPage(1));
    dispatch(setMaxPage(4));

    setLoading(false);
    setWarning("Terlalu banyak permintaan, silakan coba lagi nanti");
    setTablePage(1);

    // ACTIVE POP UP
    setModalRateLimit(true);
    // ACTIVE POP UP
  };

  const tabSelectionFilter = () => tabSelected(2);

  setTimeout(() => {
    setWarning("");
  }, 5000);

  const handleTrakerSubmit = () => {
    let found = "NOT SEARCH";
    let content_name = "Cantik";
    if (isOnSearch) {
      found = "SEARCH";
    }
    if (type === 1) {
      content_name = "Cantik Banget";
    }
    layerEventGA4({
      eventAction: "select_content",
      content_id: "interaction",
      content_type: "Button Click",
      content_name: `${content_name} - ${found}`,
      content_section: "Body Page",
    });
  };

  return (
    <React.Fragment>
      <div className="pilih-container h-full p-3 mb-4 border-t-2 border-light-greyflex">
        <SEO
          title={"Pilih Kartu Perdana Dengan Paket Yang Kamu Inginkan"}
          description="Dapatkan beragam promo diskon hingga kuota untuk setiap pembelian kartu perdana AXIS di AXIS Store. Pilih kartu perdana dengan paket yang kamu inginkan disini!"
        />

        {warning ? (
          <div className="bg-[#F3CED9] h-[58px] text-center flex items-center justify-center font-Museo-Bold text-[#C40D42]">
            <RiErrorWarningLine size={20} className="mr-2" /> {warning}
          </div>
        ) : (
          <>
            <div className="headline font-Museo-Medium tracking-wider md:text-3xl text-2xl py-2">
              Pilih Nomor
            </div>
            <div className="md:text-lg text-sm font-Museo-Light mt-2">
              Pilih nomor dari daftar dibawah <span className="text-bold">atau</span> masukkan 3 digit angka yang kamu inginkan
            </div>
            {/* Search */}
            <div className="pt-4">
              <Searchbar
                pattern={pattern}
                type={type}
                isNotFound={isNotFound}
                fillterPattern={fillterPattern}
                setIsOnSearch={setIsOnSearch}
              />
            </div>
            <div className="md:text-2xl text-xl font-Museo-Medium mt-4">Pilihan Nomor</div>
            <div className="md:text-lg text-sm font-Museo-Light mt-2">Tekan salah satu nomor untuk melanjutkan proses</div>

            {/* Tab */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between shadow-lg w-full border-2 rounded-sm border-light-gray mt-4">
                <div
                  className={`${type == 0 ? 'border-[2.5px] border-green-success duration-500 font-Museo-Bold text-biruxl shadow-lg' : 'border border-r-2 text-deep-gray font-Museo-Medium'} w-[50%] text-center md:text-lg text-md md:py-2 py-1 hover:cursor-pointer`}
                  onClick={tabSelectionReguler}
                >Cantik</div>
                <div
                  className={`${type == 1 ? 'border-[2.5px] border-green-success duration-500 font-Museo-Bold text-biruxl shadow-lg' : 'border-none text-deep-gray font-Museo-Medium'} w-[50%] text-center md:text-lg text-md md:py-2 py-1 hover:cursor-pointer`}
                  onClick={tabSelectionPremium}
                >Cantik Banget</div>
              </div>
              <div
                className={`w-[120px] ${type == 2 ? 'border-2 border-green-success' : 'border border-light-gray shadow-md'} px-3 py-2 rounded-3xl flex items-center justify-center gap-2 transition ease-in-out hover:scale-110 duration-300 hover:cursor-pointer`}
                onClick={() => setOpenFilter(true)}
              >
                <FaFilter size={16} />
                <div className="font-Museo-Medium text-biruxl text-md uppercase tracking-wider">Filter</div>
              </div>
            </div>
          </>
        )}

        {/* List Msisdn */}
        {loading ? (
          <IconWaiting
            headers="Nomor pilihan Anda akan segera tampil"
            param=""
          />
        ) : isNotFound ? (
          <NotFound />
        ) : (
          <NumberList
            type={type}
            list={number}
            page={page}
            lengthPage={lengthPage}
            setPageHandler={setPageHandler}
            setOnNextGetNumber={setOnNextGetNumber}
            setWarning={setWarning}
            isOnSearch={isOnSearch}
            loading={loading}
            changeNumber={changeNumber}
            selected={rechangeNumber}
            handleTrakerSubmit={handleTrakerSubmit}
          />
        )}
      </div>
      {modalRateLimit && (
        <RateLimit
          modalRateLimit={modalRateLimit}
          setModalRateLimit={setModalRateLimit}
        />
      )}
      <XFilter
        modal={openFilter}
        setModal={setOpenFilter}
        category={category}
        setCategory={setCategory}
        rangePrice={rangePrice}
        setRangePrice={setRangePrice}
        tabSelectionFilter={tabSelectionFilter}
      />
    </React.Fragment>
  );
};

export default PilihEsim;
