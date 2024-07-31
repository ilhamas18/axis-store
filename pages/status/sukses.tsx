import * as React from "react";
import Image from "next/image";
import ClipBoard from "@components/global/clipboard";
import { Button } from "@components/templates/button/button";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import SEO from "@components/global/seo";
import Script from "next/script";
import SurveyForm from "@components/global/survey/surveyForm";

const Status = () => {
  const [isSurveyForm, setIsSurveyForm] = React.useState<boolean>(false);

  const { product, productESim, delivery, personal, payment, payload } = useSelector(
    (state: State) => ({
      product: state.product.product,
      productESim: state.product.productESim,
      delivery: state.delivery,
      personal: state.personal.personal,
      payment: state.payment,
      payload: state.payload,

    }),
    shallowEqual
  );

  return (
    <div className="container">
      <SEO title={"Status Sukses"} />
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
        <div
          className={`px-4 ${payment.trxid ? "border-b-4 border-light-gray" : ""
            }`}
        >
          <div className="pb-5">
            <div className="image flex align-middle justify-center py-5 ">
              <Image
                src="/icons/success.svg"
                width={120}
                height={120}
                className="mt-1"
                alt="success esim"
              />
            </div>
            <div>
              {productESim?.name ? (
                <>
                  <div className="text-center shadow-sm border border-t-gray-100 rounded-xl p-4 font-Museo">
                    <div className="pt-2 pb-4 ">
                      <h3 className="md:text-2xl text-lg font-Museo-Medium">
                        Transaksi eSIM Berhasil
                      </h3>
                    </div>
                    <hr />
                    <div className="space-y-3 font-Museo mb-3">
                      <div className="list-info flex justify-between mt-5">
                        <div className="list-label md:text-md text-sm">Paket</div>
                        <div className="list-value font-Museo-Medium md:text-md text-sm">
                          {productESim.name} {productESim.kuota_full}, {productESim.day} {"hr"}
                        </div>
                      </div>
                      <div className="list-info flex justify-between">
                        <div className="list-label md:text-md text-sm">Nomor eSIM</div>
                        <div className="list-value font-Museo-Medium md:text-md text-sm">
                          {(payload?.selected)?.replace("62", "0")}
                        </div>
                      </div>
                      <div className="list-info flex justify-between">
                        <div className="list-label md:text-md text-sm">Nomor Transaksi</div>
                        <div className="list-value font-Museo-Medium md:text-md text-sm">
                          {payment.trxid}
                        </div>
                      </div>
                      <div className="list-info flex justify-between">
                        <div className="list-label md:text-md text-sm">Metode Pembayaran</div>
                        <div className="list-value font-Museo-Medium md:text-md text-sm">
                          {payment.method.type} {payment.method.name}
                        </div>
                      </div>

                      <div className="list-info flex justify-between">
                        <div className="list-label md:text-md text-sm">Jumlah Tagihan</div>
                        <div className="list-value font-Museo-Medium md:text-md text-sm">
                          {delivery.province
                            ? priceNumber(
                              product?.price + delivery?.courier?.price
                            )
                            : priceNumber(productESim?.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex flex-row items-center justify-center rounded-[12px] bg-light-blue p-4">
                      <div className="flex justify-between gap-2 w-full">
                        <div className="flex flex-col w-[70%]">
                          <div className="text-sm md:sm:text-md font-Museo">
                            <h3 className="font-Museo-Bold text-base md:text-lg mb-4">
                              Belum dapet email aktivasi?
                            </h3>
                          </div>
                          <div className="font-Museo text-sm">Kamu nggak perlu khawatir! Langsung aja hubungi kami melalui email cs@axis.co.id</div>
                        </div>
                        <div>
                          <Image
                            src="/esim/email_success.svg"
                            width={100}
                            height={100}
                            className=""
                            alt="Info"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <SurveyForm isClickSurvey={isSurveyForm} setIsClickSurvey={setIsSurveyForm} />
                  </div>
                </>
              ) : (
                <>
                  <div className="py-5 ">
                    <h3 className="md:text-2xl text-lg font-Museo-Medium">
                      Transaksi eSIM Berhasil
                    </h3>
                  </div>
                </>
              )}
            </div>
            {!payment.trxid && (
              <>
                <Button
                  variant="axis"
                  type="secondary"
                  className="button-container mt-10"
                  rounded
                  onClick={() => {
                    location.href = "/pilih";
                  }}
                >
                  <div className="flex justify-center items-center font-Museo-Medium ">
                    <span className="button-text">Lakukan pemesanan lagi</span>
                  </div>
                </Button>
                <Button
                  variant="axis"
                  className="button-container mt-3"
                  rounded
                  onClick={() => {
                    location.href = "/cek-status";
                  }}
                >
                  <div className="flex justify-center items-center font-Museo-Medium ">
                    <span className="button-text">
                      Cek status transaksi Anda
                    </span>
                  </div>
                </Button>
                <Button
                  variant="axis"
                  className="button-container mb-5 mt-3"
                  rounded
                  onClick={() => {
                    location.href = "/";
                  }}
                >
                  <div className="flex justify-center items-center font-Museo-Medium text-white">
                    <span className="button-text">
                      Kembali ke Halaman Utama
                    </span>
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>

        {personal.name && (
          <>
            <div className="px-4 mt-5 border-b py-4">
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
                  {personal?.phone && personal?.phone != "null" && (
                    <div className="list-info flex justify-between">
                      <div className="list-label">No Telp</div>
                      <div className="list-value font-Museo-Medium">
                        {personal.phone}
                      </div>
                    </div>
                  )

                  }
                  <div className="list-info flex justify-between">
                    <div className="list-label">Email</div>
                    <div className="list-value font-Museo-Medium">
                      {personal.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Status;
