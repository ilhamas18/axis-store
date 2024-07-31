import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import Image from "next/image";
import StepList from "@components/global/steplist";
import { dataAtmBca, dataMbBca } from "@components/data";
import ClipBoard from "@components/global/clipboard";

import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import SEO from "@components/global/seo";
import Script from "next/script";
import { addsProcessLand } from "src/data-layer/adds";
import SurveyForm from "@components/global/survey/surveyForm";

const Status = () => {
  const router = useRouter();
  const handleNext = () => { };
  const [isSurveyForm, setIsSurveyForm] = useState<boolean>(false);

  const { product, delivery, personal, payment } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      personal: state.personal.personal,
      payment: state.payment,
    }),
    shallowEqual
  );

  useEffect(() => {
    addsProcessLand();
  }, []);

  return (
    <div className="container">
      <SEO title={"Status Proses"} />
      <iframe
        src="https://9562726.fls.doubleclick.net/activityi;src=9562726;type=xlweb0;cat=dan_x006;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1;num=1?"
        width="1"
        height="1"
        frameBorder="0"
        style={{ display: "none" }}
      ></iframe>
      <Script type="text/javascript" strategy="lazyOnload">
        {`twq('event', 'tw-o48oj-odwd7', {})`}
      </Script>
      <div className="body pb-6">
        <div>
          <div className="image flex align-middle justify-center py-5">
            <Image
              src="/icons/packing.png"
              width={120}
              height={120}
              className="mt-1"
              alt="packing"
            />
          </div>
          <div className="px-4">
            {product?.name === "" ||
              payment.trxid === "" ||
              payment.method.name === "" ||
              personal.email === "" ||
              delivery?.courier?.name === "" ? (
              <div className="py-5">
                <h3 className="text-xl font-Museo-Bold">Pesanan Kosong</h3>
              </div>
            ) : (
              <>
                <div className="text-center shadow-card font-Museo px-4 py-2">
                  <div className="py-5">
                    <h3 className="text-xl font-Museo-Bold">Pesanan Diproses</h3>
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
                    <div className="list-value">
                      {payment.method.type} {payment.method.name}
                    </div>
                  </div>
                  <div className="list-info">
                    <div className="list-label">Email</div>
                    <div className="list-value">{personal.email}</div>
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
                <div className="py-4 border-b-4 border-light-gray">
                  <div className="card-payment-info">
                    <div className="content">
                      <div className="ml-5 text-md w-5/6 text-left">
                        <p className="font-bold">{payment.trxid}</p>
                        <span className="text-sm">Nomor Transaksi</span>
                      </div>
                      <ClipBoard text={payment.trxid} />
                    </div>
                  </div>
                </div>
                <SurveyForm isClickSurvey={isSurveyForm} setIsClickSurvey={setIsSurveyForm} />
              </>
            )}
          </div>
        </div>
        {personal.name && (
          <div className="px-4 mt-5">
            <div className="text-center border border-t-gray-100 rounded-xl p-4 font-Museo">
              <div className="py-5">
                <h3 className="md:text-2xl text-lg font-Museo-Medium">
                  Informasi Pemesan
                </h3>
              </div>
              <hr />
              <div className="space-y-3 font-Museo mb-3 md:text-sm text-sm">
                <div className="list-info flex justify-between mt-5">
                  <div className="list-label">Nama</div>
                  <div className="list-value font-Museo-Medium">
                    {personal.name}
                  </div>
                </div>
                <div className="list-info flex justify-between">
                  <div className="list-label">No Telp</div>
                  <div className="list-value font-Museo-Medium">
                    {personal.phone}
                  </div>
                </div>
                <div className="list-info flex justify-between">
                  <div className="list-label">Email</div>
                  <div className="list-value font-Museo-Medium">
                    {personal.email}
                  </div>
                </div>
                {delivery?.province && (
                  <>
                    <div className="list-info flex justify-between">
                      <div className="list-label w-[20%] text-left">
                        Alamat anda
                      </div>
                      <div className="list-value font-Museo-Medium w-[75%] text-right">
                        {delivery.detail.detail} , {delivery.subdistrict},{" "}
                        {delivery.district}, {delivery.cityType} {delivery.city}
                        , {delivery.province}
                        {delivery.detail.info != "" && (
                          <>({delivery.detail.info})</>
                        )}
                      </div>
                    </div>
                    <div className="list-info flex justify-between">
                      <div className="list-label">Kode pos</div>
                      <div className="list-value font-Museo-Medium">
                        {delivery.zipcode}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
