import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import Image from "next/image";
import { Button } from "@components/templates/button/button";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import SEO from "@components/global/seo";

const Timeout = () => {
  const router = useRouter();
  const handleNext = () => {
    router.push("/");
  };

  const { product, delivery, personal, payment } = useSelector(
    (state: State) => ({
      product: state.product.productESim,
      delivery: state.delivery,
      personal: state.personal.personal,
      payment: state.payment,
    }),
    shallowEqual
  );

  return (
    <div className="container">
      <SEO title={"Pembayaran Virtual Account BRI Timeout"} />
      <div className="body pb-6">
        <div className="px-4">
          <div className="image flex align-middle justify-center py-5">
            <Image
              src="/icons/info.png"
              width={100}
              height={100}
              className="mt-1"
              alt="Timeout"
            />
          </div>
          <div className="text-center shadow-card px-4 font-Museo mb-[20vh]">
            <div className="py-5">
              <h3 className="text-xl font-Museo-Bold">
                Waktu Pembayaran Habis
              </h3>
              <p className="text-sm">Silahkan lakukan pemesanan ulang</p>
            </div>
            <hr />
            {product?.name && (
              <>
                <div className="list-info mt-5">
                  <div className="list-label">Paket</div>
                  <div className="list-value">
                    {product.name} {product.kuota_full}, {product.day} {"Hari"}
                  </div>
                </div>
                <div className="list-info">
                  <div className="list-label">Nomor Transaksi</div>
                  <div className="list-value">{payment.trxid}</div>
                </div>
                <div className="list-info">
                  <div className="list-label">Metode Pembayaran</div>
                  <div className="list-value">QRIS</div>
                </div>
                <div className="list-info">
                  <div className="list-label">Jumlah Tagihan</div>
                  <div className="list-value">
                    {priceNumber(product?.price)}
                  </div>
                </div>
              </>
            )}
            <hr />
            <div className="button">
              <Button
                variant="axis"
                className="button-container mb-5 mt-3"
                rounded
                onClick={handleNext}
              >
                <div className="flex justify-center items-center font-Museo-Medium text-white">
                  <span className="button-text">Lakukan pemesanan ulang</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeout;
