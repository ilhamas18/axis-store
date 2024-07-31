import React, { useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { State } from "store/reducer";
import { setMaxPage, setMinPage } from "store/msisdn/action";

interface type {
  list: any,
  page: number,
  lengthPage: number
  setPage: any
  setOnNextGetNumber: any,
  isOnSearch: boolean
}

const Pagination = ({ list, page, setPage, lengthPage, setOnNextGetNumber, isOnSearch }: type) => {
  const dispatch = useDispatch();

  const { minPage, maxPage } = useSelector((state: State) => ({
    minPage: state.msisdn.minPage,
    maxPage: state.msisdn.maxPage
  }),
    shallowEqual
  )

  const [pageNumberLimit, setPageNumberLimit] = useState<number>(4);

  const handlePrevBtn = (val: number) => {
    setPage(val - 1);
    if ((Number(page) - 1) % pageNumberLimit == 0) {
      dispatch(setMinPage(minPage - pageNumberLimit));
      dispatch(setMaxPage(maxPage - pageNumberLimit));
    }
    setOnNextGetNumber(false);
  }

  const handleNextBtn = (val: number) => {
    setPage(val + 1);
    if ((Number(page) + 1) > maxPage) {
      dispatch(setMinPage(minPage + pageNumberLimit));
      dispatch(setMaxPage(maxPage + pageNumberLimit));
    }

    if ((Number(page) + 1) == Number(lengthPage)) {
      setOnNextGetNumber(true);
    } else {
      setOnNextGetNumber(false);
    }
  }

  const onKlik = (e: any) => {
    const value = e.target.value;
    setPage(value);

    if ((Number(e)) == Number(lengthPage)) {
      setOnNextGetNumber(true);
    } else {
      setOnNextGetNumber(false);
    }
  }

  const pages: any = [];
  [...Array(lengthPage)].map((_, index: number) => pages.push(index));

  const renderPageNumbers = pages.map((number: number) => {
    if (number + 1 <= maxPage && number + 1 >= minPage) {
      return (
        <button className={`${number + 1 == page ? 'text-white bg-biruxl w-[25px] h-[25px] rounded-full font-Museo-Bold' : 'font-Museo-Light'} cursor-pointer`} key={number} value={number + 1} onClick={(e) => onKlik(e)}>
          {number + 1}
        </button>
      )
    } else {
      return null
    }
  })

  let pageIncrement = null;
  if (pages.length > maxPage) {
    pageIncrement = <div className="mt-3 p-1"> &hellip;</div>
  }

  let pageDecrement = null;
  if (minPage > 1) {
    pageDecrement = <div className="mt-3 p-1"> &hellip;</div>
  }

  return (
    <nav aria-label="Page navigation example" className="w-full flex mt-3">
      {page != 1 && <button className="flex next-prev items-center justify-center cursor-pointer text-biruxl" onClick={() => handlePrevBtn(Number(page))}>
        <Image src={'/esim/arrow-left.svg'} width={24} height={24} alt="Back" />
      </button>}
      <div className="w-full flex justify-around items-center">
        {pageDecrement}
        {renderPageNumbers}
        {pageIncrement}
      </div>
      {isOnSearch == false || page != lengthPage ? (
        lengthPage > 1 && <button className="flex next-prev items-center justify-center cursor-pointer text-biruxl" onClick={() => handleNextBtn(Number(page))}>
          <Image src={'/esim/arrow-right.svg'} width={24} height={24} alt="Next" />
        </button>
      ) : <></>}
    </nav>
  )
}

export default Pagination