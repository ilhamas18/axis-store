import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/router";
import { GoCheck } from "react-icons/go";
import { State } from "../../../../store/reducer";

const ProgressBar = () => {
  const router = useRouter();
  const { step } = useSelector((state: State) => ({
    step: state.page.step
  }), shallowEqual);

  const stepPage = [1, 2, 3, 4, 5, 6]

  return (
    <div className="progressbar-wrapper font-Museo text-sm text-white">
      {step != 0 && (
        <div className="progressbar">
          {stepPage?.map((arrStep:any, i:number) => (
            <span key={i}>
              <ProgressBarItem
                 index={i + 1}
                 step={step}
                router={router}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

type ProgressBarInterface = {
  index: any,
  step: any,
  router: any
}

const ProgressBarItem = ({ index, step, router }: ProgressBarInterface) => {
  const active = useMemo(() => {
    return index < step ? true : false
  }, [step, index]);

  const current = useMemo(() => {
    return index == step ? true : false
  }, [step, index])

  const showText = useMemo(() => {
    return index == step + 1
  }, [step, index]);

  return (
    <div className="flex-step flex md:text-xs text-[10px]">
      <div className="space-x-[5px] text-center flex flex-row items-center justify-center">
        <div className={`progressbar__item md:w-8 md:h-8 w-6 h-6 flex items-center justify-center ${active ? `active` : ''} ${current ? 'current' : ''} rounded-full`}>
          {active ? <GoCheck width={5} height={2} /> : index}
        </div>
        <div className="text-xs items-center jutify-center pr-[6px] md:text-xs text-[10px]">
          {/* {current && <div className="font-Museo-Bold text-black">{msg}</div>}
          {showText && <div className="font-Museo-Light text-[#D1D3D4]">{msg}</div>} */}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar