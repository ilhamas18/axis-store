import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import Link from "next/link";
import { GrClose } from "react-icons/gr";
import { priceNumber } from "@components/global/mixins";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { setCourier } from "store/delivery/action";
import { useDispatch } from "react-redux";

interface type {
  openService: boolean;
  setService: any;
  data: any;
}

const ModalCourier = ({ openService, setService, data }: type) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { delivery, product } = useSelector(
    (state: State) => ({
      delivery: state.delivery,
      product: state.product,
    }),
    shallowEqual
  );
  const onClose = () => {
    // location.reload();
    setService(false);
  };

  return (
    <CommonModal isOpen={openService} onClose={onClose} animate={true}>
      <div className="flex flex-col items-center justify-center pt-3">
        <div className="font-Museo-Light md:text-md text-sm max-h-[90dvh] w-full">
          <div className="max-h-[70dvh]  w-full modal-scroll px-2">
            <div className="w-full px-2">
              <div className="heading relative my-2">
                <div className="text py-3">
                  <button
                    className="absolute z-10 left-2 top-5 "
                    onClick={() => onClose()}
                  >
                    <GrClose size={20} />
                  </button>
                  <h2 className="font-Museo-Bold text-lg text-center my-1">
                    {data?.courier_code}
                  </h2>
                </div>
                <hr />
              </div>

              <div className="body">
                <h3 className="font-Museo-Bold text-base">Jasa ekspedisi</h3>
                <div className="list">
                  {data?.services
                    ?.sort(function (a: any, b: any) {
                      return a.total_fee - b.total_fee;
                    })
                    ?.map((itemsub: any, indexsub: number) => (
                      <div
                        className="card-courier border !my-3 cursor-pointer relative"
                        key={indexsub}
                        onClick={() => {
                          dispatch(
                            setCourier({
                              name: data.courier_code,
                              group: itemsub?.service_name
                                ?.replace("Anteraja", "")
                                ?.replace("_", " "),
                              code: itemsub?.service_code,
                              price: itemsub?.total_fee,
                              est: itemsub?.etd,
                            })
                          );
                          onClose();
                        }}
                      >
                        {/* promo */}
                        {itemsub.total_fee < itemsub.rates && (
                          <div className="promo h-8">
                            <div className="absolute z-30 top-0 w-2/3 left-0 rounded-br-2xl h-[30px] rounded-tl-2xl bg-biruxl text-white flex items-center justify-center">
                              Promo Ongkos kirim
                            </div>
                          </div>
                        )}
                        <div className="content">
                          <div className="image">
                            <Image
                              src={`/icons/couriers/${data.courier_code.toLowerCase()}.png`}
                              width={30}
                              height={30}
                              alt={data.courier_code}
                            />
                          </div>
                          <div className="ml-4 font-Museo text-md w-4/5">
                            <p className="font-Museo-Bold flex gap-2">
                              <span>
                                {itemsub.service_name
                                  .replace("Anteraja", "")
                                  .replace("_", " ")} {" - "}
                                {priceNumber(itemsub.total_fee)}
                              </span>
                              {/* normal coret */}
                              {itemsub.total_fee < itemsub.rates && (
                                <span className="text-slate-500 line-through">
                                  {priceNumber(itemsub.rates)}
                                </span>
                              )}
                            </p>
                            <span className="text-sm text-slate-500">
                              {itemsub?.etd
                                ?.replace("hari", "hari pengiriman")
                                ?.replace("Day", "hari pengiriman")
                                ?.replace("days", "hari pengiriman")
                                ?.replace("0 hari pengiriman", "")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default ModalCourier;
