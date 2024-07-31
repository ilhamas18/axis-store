import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";

import { Button } from "@components/templates/button/button";
import {
  priceNumber,
  priceNumberEmail,
  separateNumberString,
} from "@components/global/mixins";

interface type {
  item: any;
  data: any;
  dataCasback: any;
  selectProduct: any;
  setSelectProduct: any;
  index?: any;
  handleChangeTraker?: any;
  handleChangeTrakerAll?: any;
  length: number;
  handleNext: (data: any) => void;
  handleDetail: (data: any) => void;
  handleDetailType: (data: any) => void;
}
export default function Product({
  item,
  data,
  dataCasback,
  index,
  handleChangeTraker,
  handleChangeTrakerAll,
  length,
  handleNext,
  handleDetail,
  handleDetailType,
}: type) {
  const router = useRouter();

  const [inViewRef, inView] = useInView({
    threshold: 1,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (inView) {
      handleChangeTrakerAll(data, index, length);
    }
    if (inView && [0, 1, 2].includes(index)) {
      handleChangeTraker(data, index);
    }
  }, [inView]);

  return (
    <div ref={inViewRef}>
      <div className="card relative card-pilih rounded-2xl w-full shadow-xl mt-8">
        <div className="p-4">
          {data.ribbon_flag && (
            <>
              {data.ribbon_label === "Favorite" && (
                <img
                  src="/icons/Ribbon.png"
                  className="w-[20dvw] animate-pulse transition-all md:w-[127px] absolute -right-[17px] md:-right-7 md:-top-[20px] -top-[14px]"
                  alt="Favorit"
                />
              )}
              {data.ribbon_label === "Ter-Hitz" && (
                <img
                  src="/icons/Ribbon-1.png"
                  className="w-[20dvw] animate-pulse transition-all md:w-[130px] absolute -right-[17px] md:-right-7 md:-top-[20px] -top-[14px]"
                  alt="Favorit"
                />
              )}
              {data.ribbon_label === "gopay" && (
                <img
                  src="/icons/ribbon_gopay.png"
                  className="w-[37dvw] animate-pulse transition-all md:w-[210px] absolute  -right-[13px] md:-right-5 md:-top-[20px] -top-[16px]"
                  alt="Favorit"
                />
              )}
            </>
          )}
          <div className="flex flex-row">
            <div className="w-[60%] flex flex-row font-Museo text-sm text-white text-center items-center justify-center">
              {data.label_promo && (
                <div className="absolute z-20 w-[40%] md:w-[30%] rounded-br-2xl h-[30px] left-[25%] md:left-[28%] top-0 bg-blue-50  text-biruxl font-bold flex items-center justify-center text-center">
                  {data.label_promo}
                </div>
              )}
            </div>
          </div>
          <div
            className={`${
              data.label_promo ? "mt-10" : data.ribbon_flag ? "mt-3" : ""
            } content border-b-2 border-light-gray pb-2 items-center`}
          >
            <div className="flex">
              <div className="flex">
                <div className="card-bg-quota">
                  <Image
                    src="/icons/img_bg-kuota.png"
                    width={200}
                    height={200}
                    className="!h-[83px] !w-[75px]"
                    alt="Logo Sukses"
                  />
                  <div className="quota-inner">
                    <h5 className="text-[14px]">{data.kuota_utama}</h5>
                    {data.kuota_bonus && (
                      <p>
                        <span>+</span>
                        {data.kuota_bonus}
                      </p>
                    )}
                  </div>
                </div>
                <div className="">
                  {data.tag.flat_ongkir_status && (
                    <div className="w-[fit-content] px-1 py-[2px] mb-2 bg-orange-300 rounded-[3px] justify-center items-center flex">
                      <div className="font-light text-[12px] uppercase px-1">
                        FLAT ONGKIR
                      </div>
                    </div>
                  )}
                  <div className="text-lg leading-6 font-Museo-Bold">
                    {data.name}
                  </div>
                  <p className="font-normal text-[#333333] text-sm">
                    {`${data.kuota_utama} kuota utama ${
                      data.kuota_bonus
                        ? `+ ${data.kuota_bonus} kuota lainnya`
                        : ""
                    }`}
                  </p>
                  <div
                    onClick={() =>
                      handleDetail({
                        benefit: data.benefit,
                        kuota_loyalti: data.bonus[0]?.kuota_loyalti,
                        kuota_pelanggan_baru:
                          data.bonus[0]?.kuota_pelanggan_baru,
                        data: data,
                        handleChange: () => handleNext({ objdata: data }),
                        handleAction: () =>
                          handleDetailType({
                            data: item,
                            type: "detail",
                            handleChange: (setSelected: any) => {
                              handleNext({
                                objdata: setSelected,
                              });
                            },
                          }),
                      })
                    }
                    className="cursor-pointer text-sm font-bold mt-2 text-[#EB008B]"
                  >
                    LIHAT DETAIL
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="price">
              <div className="font-Museo-Bold text-lg text-biruxl flex items-start">
                <div className="text-[14px] mt-[-3px] mr-[-3px]">Rp</div>
                <div className="text-[25px]">
                  {priceNumberEmail(data.price)}
                </div>
              </div>
              <div className="flex items-center">
                {data.before_price !== 0 && data.before_price > data.price && (
                  <div className="font-Museo-Medium text-sm mt-1 line-through text-[#858585] mr-2">
                    {priceNumber(data.before_price)}
                  </div>
                )}
                {data.label_discount && (
                  <div className="w-[fit-content] px-1 py-[3px] mt-1 bg-[#FC4C0033] rounded-[5px] justify-center items-center flex">
                    <div className="text-[#FC4C00] text-[10px] font-extrabold uppercase px-1">
                      {data.label_discount}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-3 items-center">
              <Button
                onClick={() =>
                  handleDetailType({
                    data: item,
                    handleChange: (setSelected: any) => {
                      handleNext({
                        objdata: setSelected,
                      });
                    },
                  })
                }
                variant="axis"
                className="btn-sm button button-container px-10 h-[40px] button-sm text-md font-Museo-Bold uppercase tracking-widest"
                rounded
              >
                Beli
              </Button>
            </div>
          </div>
        </div>
        {dataCasback && (
          <div className="w-100 px-4 py-2 bg-gradient-to-br from-pink-500 to-amber-400 rounded-bl-lg rounded-br-lg justify-between items-center flex">
            <div className="text-white text-[11px] font-bold uppercase">
              {dataCasback[0].tag.cashback_text}
            </div>
            <div className="justify-end items-center gap-1 flex">
              {dataCasback[0].tag.payment.length !== 0 &&
                dataCasback[0].tag.payment.map((item: any, i: number) => (
                  <div className="relative bg-white rounded-full" key={i}>
                    <img
                      width={80}
                      height={80}
                      className={`!h-[20px] !w-[20px] ${
                        item.cashback_brand === "ovo" && "p-0.5"
                      }`}
                      src={item.brand_image}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
