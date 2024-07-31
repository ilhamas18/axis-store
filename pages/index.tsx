import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useScroll } from "framer-motion";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { GrFormNext } from "react-icons/gr";
import SEO from "@components/global/seo";
import { layerEventGA3, layerEventGA4 } from "src/data-layer";
import {
  setAddrProvince,
  setAddrCity,
  setAddrCityType,
  setAddrDistrict,
  setAddrSubDistrict,
  setAddrZipCode,
  setAddrDetailInfo,
  setCourier,
} from "store/delivery/action";
import { setPersonal } from "store/personal/action";
import {
  setPaymentMethod,
  setPaymentAccount,
  setReservedNumber,
  setTrxId,
  setPaymentAccountWallet,
} from "store/payment/action";
import Stock from "@components/global/modal/stock";
import { CheckStock } from "pages/api/igw";
import { setProduct, setProductESim } from "store/product/action";
import {
  setChangeNumber,
  setEmail,
  setExisting,
  setName,
  setPrice,
  setSelected,
  setSelectedEncrypt,
  setTnCToken,
} from "store/payload/action";
import { addsHomeLand, addsHomeAction } from "src/data-layer/adds";
import { State } from "store/reducer";
import { setUuid } from "store/uuid/action";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "./api/auth";
import useToast from "src/hooks/useToast";
import SEOFooterHome from "@components/global/footer/seo-footer-home";

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const { asPath } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [openNotStock, setNotStock] = useState<boolean>(false);
  const addToast: any = useToast();

  const fetchStock = async () => {
    try {
      const check = await CheckStock();

      if (check?.data?.result?.data == false) {
        setNotStock(true);
      }
    } catch (error) {}
  };

  function check_ga() {
    if (document.readyState == "complete") {
      addsHomeLand();
    } else {
      setTimeout(check_ga, 500);
    }
  }

  useEffect(() => {
    fetchStock();
    check_ga();
  }, []);

  const dispatch = useDispatch();

  const orderSteps = [
    {
      no: 1,
      msg: "Pilihlah paket yang sesuai dengan kebutuhan",
    },
    {
      no: 2,
      msg: "Isi alamat dan isi data diri Anda",
    },
    {
      no: 3,
      msg: "Pilih metode pembayaran Anda",
    },
    {
      no: 4,
      msg: "Tunggu pesanan Anda sampai tujuan",
    },
  ];

  useEffect(() => {
    dispatch(setPaymentMethod({}));
    dispatch(setPaymentAccount({}));
    dispatch(setReservedNumber(""));
    dispatch(setTrxId(""));
    dispatch(setPaymentAccountWallet([]));
    dispatch(setAddrProvince(""));
    dispatch(setAddrCity(""));
    dispatch(setAddrCityType(""));
    dispatch(setAddrDistrict(""));
    dispatch(setAddrSubDistrict(""));
    dispatch(setAddrZipCode(""));
    dispatch(setAddrDetailInfo(""));
    dispatch(setPersonal({ name: "", email: "", phone: "" }));
    dispatch(
      setProduct({
        id: "",
        serviceId: "",
        name: "",
        price: "",
        kuota: "",
        kuota_double: "",
        day: "",
        cmid: "",
        category: "",
        before_price: "",
        kuota_full: "",
        url: "",
      })
    );
    dispatch(
      setProductESim({
        id: "",
        serviceId: "",
        name: "",
        price: "",
        kuota: "",
        kuota_double: "",
        day: "",
        cmid: "",
        before_price: "",
        kuota_full: "",
      })
    );
    dispatch(setChangeNumber(false));
    dispatch(setSelected([]));
    dispatch(setSelectedEncrypt([]));
    dispatch(setExisting([]));
    dispatch(setName([]));
    dispatch(setEmail([]));
    dispatch(setPrice([]));
    dispatch(setChangeNumber(false));
    dispatch(setTnCToken(""));
    dispatch(setCourier({}));
  }, [dispatch]);

  const bannerList = [
    {
      id: "1",
      title: "Beli Nomor Baru, Ongkos Kirim Hanya Rp9.000",
      subtitle: "Nggak Pake Ribet, Langsung Sampe Alamat Kamu!",
      imgUrlDesktop: "/banner/img_banner-v2-1.webp",
      imgUrlMobile: "/banner/img_banner-v2-2.webp",
      detailWording: `${loading ? "Loading ..." : "Selengkapnya"}`,
      buttonWording: `${loading ? "Loading ..." : "Pesan Kartu Perdana"}`,
      detailUrl: "/pilih",
      buttonLink: "/pilih",
      order: "1",
    },
    {
      id: "2",
      title: "Diskon Hingga 50% Setiap Pembelian Kartu SIM atau eSIM",
      subtitle: "",
      imgUrlDesktop: "/banner/banner_2.webp",
      imgUrlMobile: "/banner/banner_4.webp",
      detailWording: `${loading ? "Loading ..." : "Selengkapnya"}`,
      buttonWording: `${loading ? "Loading ..." : "Pesan Kartu Perdana"}`,
      detailUrl: "/pilih",
      buttonLink: "/pilih",
      order: "2",
    },
  ];

  const handleNextPage = async (link: any) => {
    if (!loading) {
      setLoading(true);
      const token = await getToken();

      if (token !== undefined) {
        router.push({
          pathname: link,
          query: {
            ...router?.query,
          },
        });
        dispatch(setUuid(uuidv4()));
      } else {
        addToast(
          "Maaf, koneksi atau server sedang bermasalah. Silakan tunggu beberapa saat lagi !"
        );
        setLoading(false);
      }
    }
  };

  interface CustomDotType {
    index?: any;
    onClick?: any;
    active?: any;
  }

  const CustomDot = ({ index, onClick, active }: CustomDotType) => {
    return (
      <li
        className={`
            ${
              active
                ? "active h-[5px] w-6 rounded-full bg-[#f5f5f5] text-right"
                : "inactive h-[5px] w-6 rounded-full bg-slate-400 text-right"
            }
          `}
        onClick={() => onClick()}
      ></li>
    );
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      partialVisibilityGutter: 80,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 30,
    },
  };

  return (
    <div className="min-h-[700px] relative">
      <SEO />

      <Stock openNotStock={openNotStock} setNotStock={setNotStock} />
      <div className="md:hidden block">
        <div className="slider relative">
          <Carousel
            responsive={responsive}
            showDots={true}
            swipeable={false}
            draggable={false}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            arrows={false}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            customDot={<CustomDot />}
            itemClass="carousel-item-padding-40-px"
          >
            {bannerList.map((item: any, i: number) => (
              <div
                id="home"
                className="w-full flex flex-col content-center justify-center"
                key={i}
              >
                <img
                  className="object-contain w-full"
                  src={item.imgUrlMobile}
                />
                <div
                  className={`h-fit custom-opacity-img absolute w-[90%] mx-4 flex flex-col px-4 justify-end pb-11 ${i !== 0 ? "bottom-[0%] right-[2%]" : "bottom-[0%] right-[2%]"}`}
                >
                  <button
                    onClick={() => {
                      layerEventGA3(asPath, item.detailWording);
                      layerEventGA4({
                        eventAction: "select_content",
                        content_type: "Text Click",
                        content_id: "interaction",
                        content_name: item.detailWording,
                        content_section: "Main Banner",
                      });
                      handleNextPage(item.detailUrl);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="mr-2 font-Museo-Bold text-white text-sm uppercase tracking-wider">
                        {item.detailWording}
                      </div>
                      <Image
                        src="/icons/ic_arrow-right-white.svg"
                        width={7}
                        height={7}
                        className="mt-0.5"
                        alt="icon"
                      />
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      layerEventGA3(asPath, item.buttonWording);
                      layerEventGA4({
                        eventAction: "select_content",
                        content_type: "Button Click",
                        content_id: "interaction",
                        content_name: item.buttonWording,
                        content_section: "Main Banner",
                      });
                      addsHomeAction();
                      handleNextPage(item.buttonLink);
                    }}
                  >
                    <div className="flex items-center justify-center mt-5 px-5 bg-green-success text-white py-2 uppercase tracking-widest text-md font-Museo-Bold tracking-wider rounded rounded-[24px]">
                      {item.buttonWording}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="md:block hidden">
        <div className="slider relative">
          <Carousel
            responsive={responsive}
            showDots={true}
            swipeable={false}
            draggable={false}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            arrows={false}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style !right-[unset]"
            customDot={<CustomDot />}
            itemClass="carousel-item-padding-40-px"
          >
            {bannerList.map((item: any, i: number) => (
              <div
                id="home"
                className="w-full flex flex-col content-center justify-center"
                key={i}
              >
                <img
                  className="object-contain w-full"
                  src={item.imgUrlDesktop}
                />
                <div
                  className={`custom-opacity-img absolute flex flex-col justify-center pt-4 w-[40%] h-fit ${i !== 0 ? "bottom-[20%] right-[11%] lg:right-[8.5%] xl:right-[7%]" : "bottom-[20%] left-[20%] lg:left-[11.5%] xl:left-[11%]"}`}
                >
                  <div className="container text-white">
                    <button
                      onClick={() => {
                        layerEventGA3(asPath, item.detailWording);
                        layerEventGA4({
                          eventAction: "select_content",
                          content_type: "Text Click",
                          content_id: "interaction",
                          content_name: item.detailWording,
                          content_section: "Main Banner",
                        });
                        handleNextPage(item.detailUrl);
                      }}
                    >
                      <div className="flex text-white items-center">
                        <div className="mr-2 font-Museo-Medium text-white text-md uppercase tracking-widest">
                          {item.detailWording}
                        </div>
                        <Image
                          src="/icons/ic_arrow-right-white.svg"
                          width={8}
                          height={8}
                          className="mt-0.5"
                          alt="icon"
                        />
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        layerEventGA3(asPath, item.buttonWording);
                        layerEventGA4({
                          eventAction: "select_content",
                          content_type: "Button Click",
                          content_id: "interaction",
                          content_name: item.buttonWording,
                          content_section: "Main Banner",
                        });
                        addsHomeAction();
                        handleNextPage(item.buttonLink);
                      }}
                      className="w-full"
                    >
                      <div className="flex items-center justify-center mt-5 px-10 w-fit bg-green-success text-white py-2 uppercase tracking-widest text-md font-Museo-Bold rounded-[24px]">
                        {item.buttonWording}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="card mt-8 flex flex-col md:grid md:grid-cols-2 md:gap-4 md:w-[86%] w-full items-center justify-center space-y-5 relative pb-10 h-full">
          <Link
            href="/cek-status"
            className="flex items-center justify-center w-full"
            onClick={() => {
              layerEventGA3(asPath, "Cek Status Pesanan");
              layerEventGA4({
                eventAction: "select_content",
                content_id: "interaction",
                content_type: "Card Click",
                content_name: "Cek Status Pesanan",
                content_section: "Body Page",
              });
              dispatch(setUuid(uuidv4()));
            }}
          >
            <div className="border-light-gray border-2 md:p-6 p-4 rounded-lg flex flex-row justify-between items-center w-[80%] md:mt-5 md:w-full space-x-4 hover:cursor-pointer">
              <Image
                src="/icons/cek-status-pesanan.svg"
                width={32}
                height={32}
                alt="Cek Status Pesanan"
              />
              <div className="flex flex-col space-y-2 grow">
                <div className="font-Museo-Bold md:text-lg text-md">
                  Cek Status Pesanan
                </div>
                <div className="font-Museo-Light text-sm text-[#999999]">
                  Sudah melakukan pemesanan? Cek status pesananmu
                </div>
              </div>
              <div>
                <GrFormNext size={22} />
              </div>
            </div>
          </Link>
          <Link
            href="https://pilih.axis.co.id/"
            target="_blank"
            className="flex items-center justify-center w-full"
            onClick={() => {
              layerEventGA3(asPath, "Ganti Nomor");
              layerEventGA4({
                eventAction: "select_content",
                content_id: "interaction",
                content_type: "Card Click",
                content_name: "Ganti Nomor",
                content_section: "Body Page",
              });
            }}
          >
            <div className="border-light-gray border-2 md:p-6 p-4 rounded-lg flex flex-row justify-between items-center w-[80%] md:w-full space-x-4">
              <Image
                src="/icons/ganti-nomor.svg"
                width={32}
                height={32}
                alt="Ganti nomor"
              />
              <div className="flex flex-col space-y-2 grow">
                <div className="font-Museo-Bold md:text-lg text-md">
                  Ganti Nomor
                </div>
                <div className="font-Museo-Light text-sm text-[#999999]">
                  Dapatkan nomor menarik sesuai dengan yang kamu mau!
                </div>
              </div>
              <div>
                <GrFormNext size={22} />
              </div>
            </div>
          </Link>
          {/* <Link href="/pilih-esim" className="flex items-center justify-center w-full">
            <div className="border-light-gray border-2 md:p-6 p-4 rounded-lg flex flex-row justify-between items-center w-[80%] md:mt-5 md:w-full space-x-4 hover:cursor-pointer">
              <Image src="/icons/pindah-esim.svg" width={32} height={32} alt="Pindah eSim" />
              <div className="flex flex-col space-y-2 grow">
                <div className="font-Museo-Bold md:text-lg text-md">Pindah ke e-SIM</div>
                <div className="font-Museo-Light text-sm text-[#999999]">Pindah dari nomor fisik ke e-SIM. Kunjungi XL Center terdekat!</div>
              </div>
              <div>
                <GrFormNext size={22} />
              </div>
            </div>
          </Link> */}
        </div>
        <div className="bg-[#EAD8F3]  md:grid md:grid-cols-5 md:gap-3 rounded-lg p-6 w-full flex flex-col space-y-2 md:w-[86%] w-[80%] mb-10">
          <div className="title font-Museo-Bold text-xl md:text-2xl mb-3 tracking-wider">
            Cara order Kartu Perdana
          </div>
          {orderSteps?.map((item: any, i: number) => (
            <div className="flex flex-col" key={i}>
              <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4">
                <div className="w-[5%]">
                  <div className="bg-biruxl md:w-[24px] md:h-[24px] w-[17.5px] h-[17.5px] mt-1 flex items-center justify-center rounded-full text-white text-xs">
                    {item.no}
                  </div>
                </div>
                <div className="font-Museo-Light w-[90%] text-md">
                  {item.msg}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="justify-center flex">
        <SEOFooterHome />
      </div>
    </div>
  );
}
