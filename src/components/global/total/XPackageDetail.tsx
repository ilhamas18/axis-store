import ModalBottomSheet from "../modal/bottom-sheet";
import { priceNumber } from "../mixins";
import { Button } from "@components/templates/button/button";

interface type {
  modal: boolean;
  setModal: any;
  product: any;
  productESim: any;
  selectedESim?: any;
  payload: any;
  delivery?: any;
  type?: string;
}

const XPackageDetail = ({ modal, setModal, product, productESim, selectedESim, payload, delivery, type }: type) => {
  return (
    <ModalBottomSheet
      modal={modal}
      setModal={setModal}
      title="Ringkasan Pembayaran"
      className="wrapper-package-detail"
      scrollContent
    >
      <div className="pt-6">
        {type !== "esim" ? (
          <>
            <div className="flex flex-col gap-1 border-b border-light-gray pb-3">
              <div className="text-md">
                <div className="flex items-center justify-between">
                  {product.total_kuota == true ? (
                    <div className="font-Museo-Medium text-deep-gray w-[60%]">{product.name} {product.kuota_full}</div>
                  ) : (
                    <div className="font-Museo-Medium text-deep-gray w-[60%]">{product.name} {product.kuota_utama}</div>
                  )}
                  <div className="font-Museo-Bold">{priceNumber(product.price)}</div>
                </div>
              </div>
              <div>
                {delivery?.courier?.price && (
                  <div className="flex flex-row justify-between">
                    <div className="font-Museo-Medium text-deep-gray text-md">
                      Jasa Pengiriman - {delivery?.courier?.name}{" "}
                      {delivery?.courier?.alias_name
                        ? delivery?.courier?.alias_name
                        : delivery?.courier?.group}
                    </div>
                    <div className="font-Museo-Bold text-md">
                      {priceNumber(delivery?.courier?.price)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2 items-center">
              <div className="font-Museo-Medium text-deep-gray md:text-lg text-md">
                Total
              </div>
              <div className="font-Museo-Bold text-biruxl md:text-lg text-md">
                {priceNumber(
                  parseInt(product?.price ? product?.price : 0) +
                  parseInt(
                    delivery?.courier?.price ? delivery?.courier?.price : 0
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1 border-b border-light-gray pb-3">
              <div className="text-md">
                <div className="flex items-center justify-between">
                  {product.total_kuota == true ? (
                    <div className="font-Museo-Medium text-deep-gray w-[60%]">{productESim.name} {productESim.kuota_full}</div>
                  ) : (
                    <div className="font-Museo-Medium text-deep-gray w-[60%]">{productESim.name} {productESim.kuota_utama}</div>
                  )}
                  <div className="font-Museo-Bold">{priceNumber(productESim.price)}</div>
                </div>
              </div>
              <div>
                {payload.selected_encrypt.length == 0 ? (
                  <div className="flex items-center justify-between">
                    {selectedESim.msisdn !== "" && (
                      <>
                        <div className="font-Museo-Medium text-deep-gray w-[60%]">Nomor eSIM - {selectedESim.msisdn}</div>
                        <div className="font-Museo-Bold">{priceNumber(selectedESim.price)}</div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="font-Museo-Medium text-deep-gray w-[60%]">Nomor eSIM - {"0" + payload.selected?.substring(2, payload.selected.length)}</div>
                    <div className="font-Museo-Bold">{priceNumber(payload.price)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2 items-center">
              <div className="font-Museo-Medium text-deep-gray md:text-lg text-md">
                Total
              </div>
              <div className="font-Museo-Bold text-biruxl md:text-lg text-md">
                {payload.selected_encrypt.length == 0 ? (
                  <>
                    {priceNumber(
                      parseInt(productESim?.price ? productESim?.price : 0) +
                      parseInt(selectedESim.price ? selectedESim.price : 0)
                    )}
                  </>
                ) : (
                  <>
                    {priceNumber(
                      parseInt(productESim?.price ? productESim?.price : 0) +
                      parseInt(payload.price ? payload.price : 0)
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ModalBottomSheet>
  )
}

export default XPackageDetail