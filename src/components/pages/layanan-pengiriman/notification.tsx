import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getNotif } from "pages/api/notif";

interface DataItem {
  order: number;
  name: string;
  status: boolean;
}

const HiddenTextComponent: React.FC = () => {
  const router = useRouter();
  const [dataArray, setDataArray] = useState<DataItem[] | []>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [hiddenText, setHiddenText] = useState<string | null>(null);
  const [noftif, setNotif] = useState<boolean>(false);
  const routePathAction = router.pathname === "/layanan-pengiriman";

  useEffect(() => {
    getGimmick();
  }, [router]);

  const getGimmick = async () => {
    setDataArray([]);
    setNotif(false);
    setCurrentIndex(null);
    if (routePathAction) {
      const response = await getNotif();
      const data = response.data.result.data;
      data.forEach((item: any) => {
        item.status = true;
      });
      setDataArray(data);
      const timer = setTimeout(() => {
        setNotif(true);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }

  useEffect(() => {
    const filteredDataArray = dataArray.filter((item) => item.status === true);

    if ((filteredDataArray.length === 0 && !noftif) || !dataArray) {
      setHiddenText(null);
      return;
    }

    if (currentIndex === null) {
      const randomIndex = Math.floor(Math.random() * filteredDataArray.length);
      setCurrentIndex(randomIndex);
      setHiddenText(filteredDataArray[randomIndex].name);
      return;
    }
    if (!routePathAction) {
      setDataArray([]);
      setNotif(false);
      setCurrentIndex(null);
      return;
    }
    const timers = setTimeout(() => {
      const updatedDataArray = dataArray.filter(
        (_, index) => index !== currentIndex
      );
      setDataArray(updatedDataArray);
      if (!routePathAction) {
        setDataArray([]);
        setNotif(false);
        setCurrentIndex(null);
        return;
      }
      if (updatedDataArray.length === 0) {
        setHiddenText(null);
        setNotif(false);
        return;
      }

      setNotif(false);
      const randomTimeout = Math.floor(Math.random() * 7000) + 2000;
      const timer = setTimeout(() => {
        if (!routePathAction) {
          setDataArray([]);
          setNotif(false);
          setCurrentIndex(null);
          return;
        }
        const newIndex = Math.floor(Math.random() * updatedDataArray.length);
        setNotif(true);
        setCurrentIndex(newIndex);
        setHiddenText(updatedDataArray[newIndex].name);
      }, randomTimeout);

      return () => {
        clearTimeout(timer);
      };
    }, 3000);

    return () => clearTimeout(timers);
  }, [currentIndex, dataArray, noftif, router]);

  return (
    <>
      {noftif && (
        <div
          className="notification-wrapper-pengiriman"
          onClick={() => setNotif(false)}
        >
          <div className="content">
            <div className="flex box">
              <div className="img-box">
                <Image
                  src={`/icons/ic_check.svg`}
                  width={60}
                  height={60}
                  className="img-fluid"
                  alt="Ganti nomor"
                />
              </div>
              <div>
                <p className="des">1 orang membeli</p>
                <div className="font-Museo-Bold md:text-lg text-md title">
                  {hiddenText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HiddenTextComponent;
