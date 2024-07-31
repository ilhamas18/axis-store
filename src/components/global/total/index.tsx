import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { priceNumber } from "@components/global/mixins";
import { IoIosArrowUp } from "react-icons/io";
import { Button } from "@components/templates/button/button";
import XPackageDetail from "./XPackageDetail";

interface PropTypes {
  children: any,
  type?: string
  selectedESim?: any
}

export default function Total({ children, type, selectedESim }: PropTypes) {
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);

  const { delivery, product, payload, productESim } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
      productESim: state.product.productESim,
      payload: state.payload,
    }),
    shallowEqual
  );

  return (
    <div className="md:max-w-xl md:min-w-[50vw] min-w-full m-auto fixed bottom-0 left-0 right-0 bg-white z-50 [box-shadow:-1px_-7px_26px_-15px_rgba(111,43,144,0.65)] rounded-tl rounded-tr rounded-lg px-4 py-2">
      <div className="flex flex-row justify-between items-center">
        {type !== 'esim' ? (
          <div className="flex flex-col">
            <div className="font-Museo md:text-lg text-deep-gray text-md">Total</div>
            <div className="flex font-Museo-Bold text-biruxl gap-2 items-center justify-center md:text-xl text-md" onClick={() => setIsOpenDetail(true)}>
              {priceNumber(
                parseInt(product?.price ? product?.price : 0) +
                parseInt(
                  delivery?.courier?.price ? delivery?.courier?.price : 0
                )
              )}
              <IoIosArrowUp size={20} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="font-Museo md:text-lg text-deep-gray text-md">Total</div>
            <div className="flex font-Museo-Bold text-biruxl gap-2 items-center justify-center md:text-xl text-md" onClick={() => setIsOpenDetail(true)}>
              {payload.selected_encrypt.length == 0 ? (
                <>
                  {priceNumber(
                    parseInt(productESim?.price ? productESim?.price : 0) +
                    parseInt(selectedESim?.price ? selectedESim?.price : 0)
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
              <IoIosArrowUp size={20} />
            </div>
          </div>
        )}
        <div className="w-[40%]">
          {children}
        </div>
      </div>

      <XPackageDetail
        modal={isOpenDetail}
        setModal={setIsOpenDetail}
        product={product}
        productESim={productESim}
        selectedESim={selectedESim}
        payload={payload}
        delivery={delivery}
        type={type}
      />
    </div>
  );
}
