import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

type StepInterface = {
  title?: any;
  children: any;
  floating?: boolean;
};

export default function StepList({
  title,
  children,
  floating=false,
}: StepInterface) {
  const [showSteps, setShowSteps] = useState<boolean>(false);

  return (
    <div
      className={`relative ${
        floating ? "mb-10" : "mb-2"
      } flex items-center justify-center`}
    >
      <div
        className={` ${
          floating ? "absolute z-20" : "relative z-0"
        }  bg-white top-0 border-light-grey border-2 w-full min-h-[59px] flex flex-col rounded-xl font-Museo text-light-grey`}
      >
        <div className="flex justify-between items-center px-4">
          <div className="py-4">{title}</div>
          <div className="mt-1">
            {!showSteps ? (
              <button onClick={() => setShowSteps(true)}>
                <IoIosArrowDown size={22} />
              </button>
            ) : (
              <button onClick={() => setShowSteps(false)}>
                <IoIosArrowUp size={22} />
              </button>
            )}
          </div>
        </div>
        {showSteps && (
          <div className="relative bg-white rounded-b-xl border-t-[1px]">
            <div className="m-4 py-2 border-b-[1px]">
              {children}
            </div>
            <div className="font-Museo-Medium text-bold mb-4 text-biruxl mt-2 text-center">
              <button onClick={() => setShowSteps(false)}>Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
