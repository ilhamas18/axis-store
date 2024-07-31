import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { shallowEqual, useSelector } from "react-redux";
import { State } from "store/reducer";

interface PropTypes {
  disableBtn?: any;
}

const Footer = ({ disableBtn }: PropTypes) => {
  const router = useRouter();
  let year = new Date().getFullYear();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);

  const { delivery, product } = useSelector(
    (state: State) => ({
      product: state.product.product,
      delivery: state.delivery,
    }),
    shallowEqual
  );

  return (
    <footer>
      {router.pathname === "/" ? (
        <div className="bg-biruxl text-white p-3 text-center relative z-2">
          <p className="text-sm">Copyright &copy; {year} XL Axiata</p>
          <p className="font-semibold">
            <Link
              href="https://xlaxiata.co.id/id/kebijakan-privasi"
              target={"_blank"}
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              href="https://www.axis.co.id/syarat-ketentuan"
              target={"_blank"}
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      ) : router.pathname === "/pilih" ||
        router.pathname === "/cek-status" ||
        router.pathname.includes("virtual-account") ||
        router.pathname.includes("ewallet") ||
        router.pathname === "/pembayaran/nomor" ||
        router.pathname === "/pembayaran-esim/nomor" ? (
        <div className="md:max-w-xl md:min-w-[50vw] m-auto bg-[url('/footer-v3.png')] h-[119px] -mt-12 items-center justify-center right-0 left-0 absolute">
          <div className="mt-4 flex flex-col bottom-[1.2rem] absolute right-0 left-0">
            <div className="font-Museo text-md text-white text-center">
              Copyright &#169; {year} PT XL Axiata Tbk.
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <script
        src="https://js.adsrvr.org/up_loader.1.1.0.js"
        type="text/javascript"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `ttd_dom_ready( function() {
         if (typeof TTDUniversalPixelApi === 'function') {
             var universalPixelApi = new TTDUniversalPixelApi();
             universalPixelApi.init("4ozbxpt", ["1a4naz4"], "https://insight.adsrvr.org/track/up");
         }
     });`,
        }}
      />
    </footer>
  );
};

export default Footer;
