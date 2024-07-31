import React from "react";
import { useMemo, useState, useEffect } from "react";

interface ProgressStepProps {
  props: any;
  step: number;
  openDataIndexHandler: any;
}

const ProgressStep = ({ props, step, openDataIndexHandler }: ProgressStepProps) => {
  return (
    <div className="steps-wrapper">
      <div className="progressStep-wrapper text-Museo text-xs">
        <ul className="progressStep">
          {props?.map((item: any, i: number) => (
            <ProgressStepItem
              key={i}
              index={i}
              type={item.type}
              name={item.name}
              step={step}
              openDataIndexHandler={openDataIndexHandler}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

interface type {
  index: number;
  type: string;
  name: any;
  step: number;
  openDataIndexHandler: any;
}

const ProgressStepItem = ({ index, type, name, step, openDataIndexHandler }: type) => {
  const active = useMemo(() => {
    return index <= step ? true : false
  }, [step, index])

  const after = useMemo(() => {
    return index >= step ? true : false
  }, [step, index])

  const current = useMemo(() => {
    return index == step ? true : false
  }, [step, index])

  const canClick = useMemo(() => {
    return index <= step
  }, [index, step])

  return (
    <li className={`progressStep__item ${active && 'active'} ${after && 'after'} ${current && 'after'} ${step > index + 1 ? 'canClick' : 'text-gray-400 mb-4'}`}>
      <div className="progressStep__icon flex">
        <div className="flex gap-1 font-Museo text-xs items-center justify-center">
          <div className={`${step > index + 1 ? 'bg-biruxl' : 'bg-gray-400'} w-[20px] h-[20px] rounded-full flex items-center justify-center text-white`}>{index + 1}</div>
          {canClick ? (
            <div className={`ml-2 text-biruxl font-Museo-Medium md:text-md text-sm ${canClick && 'hover:cursor-pointer'}`} onClick={() => openDataIndexHandler(index)}>
              {type !== '' ? type + ' - ' + name : name}
              {/* {name} */}
            </div>
          ) : (
            <div className="ml-2 font-Museo-Medium md:text-md text-sm">{type} {name}</div>
          )}
        </div>
      </div>
    </li>
  )
}

export default ProgressStep;