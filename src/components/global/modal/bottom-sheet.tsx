import Image from "next/image";
import { CommonModalBotoom } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";
import { checkDevice } from "../mixins";

interface type {
  modal: boolean;
  setModal: any;
  onClickAction?: any;
  children: React.ReactNode;
  title?: string;
  scrollContent?: boolean;
  className?: string;
  classNameBtn?: string;
}

const ModalBottomSheet = ({
  modal,
  setModal,
  children,
  onClickAction,
  title,
  scrollContent,
  className,
  classNameBtn,
}: type) => {
  const onClose = () => setModal(false);

  return (
    <CommonModalBotoom
      isOpen={modal}
      onClose={onClose}
      animate={true}
      className={`bottom-sheet ${className}`}
    >
      {className !== 'wrapper-esim-info' ? (
        <Image
          onClick={onClose}
          className="icon-close cursor-pointer"
          src="/icons/ic-close.png"
          width={15}
          height={15}
          alt="Logo Sukses"
        />
      ) : (
        <div className="md:hidden show">
          <Image
            onClick={onClose}
            className="icon-close cursor-pointer"
            src="/icons/ic-close.png"
            width={15}
            height={15}
            alt="Logo Sukses"
          />
        </div>
      )}
      <div className="font-Museo-Medium text-2xl tracking-wider text-center mt-6 mb-3">
        {title}
      </div>
      <div className={`wrapper-content ${scrollContent && "scroll-content"}`}>
        {children}
      </div>
      {onClickAction && (
        <div className="flex justify-center mt-4 items-center">
          <Button
            className={classNameBtn}
            onClick={onClickAction.action}
            variant="axis"
            rounded
          >
            {onClickAction.label}
          </Button>
        </div>
      )}
    </CommonModalBotoom>
  );
};

export default ModalBottomSheet;
