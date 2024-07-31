import React, { useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";

const PercentContext = createContext({});

export default PercentContext;

export function PercentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPrcentage, setPrcentage] = useState([
    { percent: 25, status: true },
    { percent: 50, status: true },
    { percent: 75, status: true },
    { percent: 90, status: true },
    { percent: 100, status: true },
  ]);

  const onScroll = () => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.body;
    const scrollHeights = scrollHeight - innerHeight;
    const percentage = (scrollY / scrollHeights) * 100;
    isPrcentage.map((obj, _, arr) => {
      if (obj.percent <= percentage && obj.status) {
        window.dataLayer.push({
          event: "scroll_depth",
          scroll_threshold: `scrollDepth ${obj.percent}%`,
        });
        // console.log(window.dataLayer);
        let newPrcentage = arr;
        const objIndex = newPrcentage.findIndex(
          (objI) => objI.percent === obj.percent
        );
        newPrcentage[objIndex].status = false;
        setPrcentage(newPrcentage);
      }
    });
  };

  useEffect(() => {
    let timer1 = setTimeout(() => {
      window.addEventListener("scroll", onScroll);

      onScroll();
    }, 300);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer1);
    };
  }, [isPrcentage]);

  useEffect(() => {
    const handleRouteChange = () => {
      setPrcentage([
        { percent: 25, status: true },
        { percent: 50, status: true },
        { percent: 75, status: true },
        { percent: 90, status: true },
        { percent: 100, status: true },
      ]);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <PercentContext.Provider value={{}}>{children}</PercentContext.Provider>
  );
}
