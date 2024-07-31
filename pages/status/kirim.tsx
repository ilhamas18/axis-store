import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import Image from "next/image";
import StepList from "@components/global/steplist";
import ClipBoard from "@components/global/clipboard";

import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import SEO from "@components/global/seo";
import Script from "next/script";

const Status = () => {
  const router = useRouter();
  const handleNext = () => { };

  const { product, delivery, personal, payment, register } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      personal: state.personal.personal,
      payment: state.payment,
      register: state.register.register,
    }),
    shallowEqual
  );

  return (
    <div className="container">
      <SEO title={"Status Kirim"} />
      <iframe
        src="https://9562726.fls.doubleclick.net/activityi;src=9562726;type=xlweb0;cat=dan_x007;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1;num=1?"
        width="1"
        height="1"
        frameBorder="0"
        style={{ display: "none" }}
      ></iframe>
      <Script type="text/javascript" strategy="lazyOnload">
        {`twq('event', 'tw-o48oj-odwd9', {})`}
      </Script>
      <div className="body pb-6">
        <div className="px-4 border-b-4 border-light-gray">
          <div className="image flex align-middle justify-center py-5">
            <Image
              src="/icons/send.png"
              width={120}
              height={120}
              className="mt-1"
              alt="Send"
            />
          </div>
          <div className="text-center shadow-card px-4 font-Museo">
            <div className="py-5">
              <h3 className="text-xl font-Museo-Bold">Pesanan Dikirim</h3>
            </div>
            <hr />
            <div className="list-info mt-5">
              <div className="list-label">Paket</div>
              <div className="list-value">{product?.name}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Nomor Transaksi</div>
              <div className="list-value">{payment.trxid}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Metode Pembayaran</div>
              {payment.method.type} {payment.method.name}
            </div>
            <div className="list-info">
              <div className="list-label">Pengiriman</div>
              <div className="list-value">
                {delivery?.courier?.name} {delivery?.courier?.group}
              </div>
            </div>
            <div className="list-info">
              <div className="list-label">Jumlah Tagihan</div>
              <div className="list-value">
                {priceNumber(product?.price + delivery?.courier?.price)}
              </div>
            </div>
          </div>
          <div className="py-5">
            {register?.awb && (
              <div className="card-payment-info">
                <div className="content">
                  <div className="image">
                    <Image
                      src={`/icons/couriers/${delivery.courier.name.toLowerCase()}.png`}
                      width={30}
                      height={30}
                      alt={delivery.courier.name}
                    />
                  </div>
                  <div className="ml-5 text-md w-3/4 mr-5">
                    <p className="font-bold">Resi {delivery.courier.name}</p>
                    <span className="text-sm text-slate-500">
                      {register?.awb}
                    </span>
                  </div>
                  <ClipBoard text={register?.awb} />
                </div>
              </div>
            )}

            <div className="card-payment-info">
              <div className="content">
                <div className="ml-5 text-md w-5/6">
                  <p className="font-bold">{payment.trxid}</p>
                  <span className="text-sm">Nomor Transaksi</span>
                </div>
                <ClipBoard text={payment.trxid} />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 mt-5">
          <div className="text-center shadow-card px-4 font-Museo">
            <div className="py-5">
              <h3 className="text-xl font-Museo-Bold">Informasi Pemesan</h3>
            </div>
            <hr />
            <div className="list-info mt-5">
              <div className="list-label">Nama</div>
              <div className="list-value">{personal.name}</div>
            </div>
            <div className="list-info">
              <div className="list-label">No Telp</div>
              <div className="list-value">087874493550</div>
            </div>
            <div className="list-info">
              <div className="list-label">Email</div>
              <div className="list-value">{personal.email}</div>
            </div>
            <div className="list-info">
              <div className="list-label">Alamat anda</div>
              <div className="list-value">
                {delivery.detail.detail} , {delivery.subdistrict},{" "}
                {delivery.district}, {delivery.cityType} {delivery.city},{" "}
                {delivery.province}
                {delivery.detail.info != "" && <>({delivery.detail.info})</>}
              </div>
            </div>
            <div className="list-info">
              <div className="list-label">Kode pos</div>
              <div className="list-value">{delivery.zipcode}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
