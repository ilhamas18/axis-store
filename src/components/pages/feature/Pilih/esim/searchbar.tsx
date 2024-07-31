import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { layerEventGA4 } from "src/data-layer";
import { IoIosSearch } from "react-icons/io";

interface type {
  pattern: string;
  type: number;
  fillterPattern: any;
  setIsOnSearch: any;
  isNotFound: boolean;
}

const Searchbar = ({
  pattern,
  type,
  fillterPattern,
  setIsOnSearch,
  isNotFound,
}: type) => {
  const router = useRouter();
  const { msisdn } = router?.query;

  const [patN, setPatN] = useState<boolean>(false);
  const [value, setValue] = useState<any>(msisdn || pattern);

  useEffect(() => {
    if (msisdn === undefined) setValue("");
  }, [msisdn]);

  const cekInput = (e: any) => {
    setValue(e.target.value);
    if (e.target.value.length >= 3) setPatN(true);
    else setPatN(false);
  };

  useEffect(() => {
    if (value != "") {
      setPatN(true);
    } else {
      setPatN(false);
    }
  }, [value]);

  const onSearchNumber = async () => {
    fillterPattern(value);
    router.push({
      pathname: "pilih-esim",
      query: {
        ...router?.query,
        msisdn: value,
      },
    });

    if (value === "") {
      router.push({ pathname: "pilih-esim" });
      setIsOnSearch(false);
    } else {
      setIsOnSearch(true);
      let found = "FOUND";
      if (isNotFound) {
        found = "NOT FOUND";
      }
      layerEventGA4({
        eventAction: "select_content",
        content_id: "interaction",
        content_type: "Search",
        content_name: `${value} - ${found}`,
        content_section: "Body Page",
      });
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div className="border-[#E2E2E2] border-2 mt-2 w-full flex flex-row justify-between">
        <label className="inline-block font-Museo flex items-center justify-center w-full">
          <input
            type="tel"
            placeholder="Max 3 angka"
            className="input flex-grow tracking-wider ml-2 focus:outline-0 p-2"
            onChange={(e) => cekInput(e)}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            maxLength={3}
            value={value}
          />
        </label>
        <button
          disabled={patN ? false : true}
          className={`bg-green-success ${patN ? "enable cursor-pointer" : "disable"
            } font-Museo px-4 py-1 text-white`}
          onClick={() => onSearchNumber()}
        >
          <IoIosSearch size={17} />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
