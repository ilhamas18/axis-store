import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import { statusNumberRelease } from "pages/api/esim";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { State } from "store/reducer";
import { useState } from "react";
import RateLimit from "@components/global/modal/rate-limit";

interface type {
  modalValidateRegister: boolean;
  setModalValidateRegister: any;
  statusModal: string;
}

const ModalbackRegister = ({
  modalValidateRegister,
  setModalValidateRegister,
  statusModal,
}: type) => {
  const router = useRouter();

  const [modalRateLimit, setModalRateLimit] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { payload } = useSelector(
    (state: State) => ({
      payload: state.payload,
    }),
    shallowEqual
  );

  const onClose = () => {
    setModalValidateRegister(false);
  };

  const onCloseBack = async () => {
    setLoading(true);
    if (statusModal == "backFromRegister") {
      const response = await statusNumberRelease(payload?.selected_encrypt);

      if (response?.status == 200) {
        setModalValidateRegister(false);
        router.push({
          pathname: "/pilih-esim",
          query: {
            ...router?.query,
            edit: false,
          },
        });
      } else if (response?.status == 429) {
        overLimit();
      } else {
        setIsError(true);
      }
    } else {
      const response = await statusNumberRelease(payload?.selected_encrypt);

      if (response.status == 200) {
        setModalValidateRegister(false);
        router.push({
          pathname: "/pilih-esim",
          query: {
            ...router?.query,
            edit: true,
          },
        });
      } else if (response.status == 429) {
        overLimit();
      } else {
        setIsError(true);
      }
    }
  };

  const overLimit = () => {
    // ACTIVE POP UP
    setModalRateLimit(true);
    // ACTIVE POP UP
  };

  return (
    <>
      <CommonModal
        isOpen={modalValidateRegister}
        onClose={onClose}
        animate={true}
      >
        {isError ? (
          <div className="flex flex-col items-center justify-center pt-3">
            <Image src="/icons/error.png" width={89.31} height={96.79} alt="Error" />
            <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">Sistem sedang gangguan</div>
            <div className="font-Museo-Light md:text-md text-sm text-center">
              Mohon maaf karena terdapat gangguan pada sistem. Anda dapat mencoba beberapa saat lagi
            </div>
            <Button variant="axis" className="button-container mb-2 mt-5" rounded onClick={() => onClose()}>
              <div className="flex justify-center items-center text-white font-Museo">
                <span className="button-text">Tutup</span>
              </div>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-3">
            <Image
              src="/icons/pilih-esim/reserve.svg"
              width={124}
              height={124}
              alt="Sorry"
            />
            <div className="font-Museo-Bold md:text-2xl text-lg tracking-wider text-center mt-6 mb-4">
              Apakah Anda Yakin Ingin Kembali ke Halaman Pilih Nomor?
            </div>
            <div className="font-Museo-Light md:text-md text-md text-center space-x-4 border-b-2 border-light-greyflex pb-4 px-4">
              Dengan kembali ke halaman pemilihan nomor, maka nomor yang Anda
              pilih sebelumnya akan kembali tersedia di halaman pemilihan nomor
              untuk semua pelanggan.
            </div>
            <div className="button w-full">
              {loading ? (
                <div>
                  <Button
                    variant="axis"
                    className="button-container mb-2 mt-5"
                    rounded
                    loading
                  >
                    <div className="flex justify-center items-center text-biru-xl font-Museo">
                      <span className="button-text">Loading</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div>
                    <Button
                      variant="secondary-axis"
                      className="button-container mb-2 mt-5"
                      rounded
                      onClick={() => onCloseBack()}
                    >
                      <div className="flex justify-center items-center text-biru-xl font-Museo">
                        <span className="button-text">Ya, Kembali</span>
                      </div>
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="axis"
                      className="button-container mb-2 mt-5"
                      rounded
                      onClick={() => onClose()}
                    >
                      <div className="flex justify-center items-center text-white font-Museo">
                        <span className="button-text">Tidak</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CommonModal>

      {modalRateLimit && (
        <RateLimit
          modalRateLimit={modalRateLimit}
          setModalRateLimit={setModalRateLimit}
        />
      )}
    </>
  );
};

export default ModalbackRegister;
