import { useRouter } from "next/router";
import Image from "next/image";
import { CommonModal } from "@components/templates/common-modal/modal";
import { Button } from "@components/templates/button/button";

interface type {
    openTrouble: boolean;
    setOpenTrouble: any;
}

const TroubleEsimMsisdn = ({ openTrouble, setOpenTrouble }: type) => {
    const router = useRouter();

    const onClose = () => {
        setOpenTrouble(false);
        router.push({
            pathname: "/pilih-esim/",
            query: {
                ...router.query,
                edit: true,
                skip: true
            },
        });
    };

    return (
        <CommonModal isOpen={openTrouble} onClose={onClose} animate={true}>
            <div className="flex flex-col items-center justify-center pt-3">
                <Image
                    src="/icons/error.png"
                    width={89.31}
                    height={96.79}
                    alt="Error"
                />
                <div className="font-Museo-Bold text-2xl tracking-wider text-center mt-6 mb-4">
                    Nomor pilihanmu <br /> sudah tidak tersedia
                </div>
                <div className="font-Museo-Light md:text-md text-sm text-center">
                    Untuk mempermudah proses pemilihan nomor eSIM, silakan pilih nomor
                    eSIM yang diinginkan dengan cara memasukkan minimal 3 hingga 6 digit
                    angka favoritmu pada form cari nomor.
                </div>
                <Button
                    variant="axis"
                    className="button-container mb-2 mt-5"
                    rounded
                    onClick={() => onClose()}
                >
                    <div className="flex justify-center items-center text-white font-Museo">
                        <span className="button-text">OK</span>
                    </div>
                </Button>
            </div>
        </CommonModal>
    );
};

export default TroubleEsimMsisdn;
