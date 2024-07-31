import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { CopyToClipboard } from "react-copy-to-clipboard";

type clipboard = {
  text: string;
};

export default function ClipBoard({ text }: clipboard) {
  const [copy, setCopy] = useState<boolean>(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      setCopy(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [copy]);

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopy(true);
      }}
    >
      {copy ? (
        <div className="w-14 text-center flex gap-1 justify-center  items-center text-green-500 font-Museo-Medium cursor-pointer">
          <IoIosCheckmarkCircle size={15} /> <span className="text-xs">Disalin</span>
        </div>
      ) : (
        <div className="w-14 text-center text-sm text-biruxl font-Museo-Medium cursor-pointer">
          Salin
        </div>
      )}
    </CopyToClipboard>
  );
}
