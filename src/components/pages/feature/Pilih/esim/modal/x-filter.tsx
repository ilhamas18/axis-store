import Image from "next/image";
import { useEffect, useState } from "react";
import ModalBottomSheet from "@components/global/modal/bottom-sheet";
import { Button } from "@components/templates/button/button";
import { GrClose } from "react-icons/gr";

interface type {
  modal: boolean;
  setModal: any;
  category: any,
  setCategory: any,
  rangePrice: any,
  setRangePrice: any,
  tabSelectionFilter: any
}

const XFilter = ({
  modal,
  setModal,
  category,
  setCategory,
  rangePrice,
  setRangePrice,
  tabSelectionFilter
}: type) => {

  const [categoryList, setCategoryList] = useState<any>([
    // {
    //   id: 1,
    //   category: 'Berurut',
    //   value: 'typeBerurut',
    //   selected: false
    // },
    // {
    //   id: 2,
    //   category: 'Berulang',
    //   value: 'typeBerulang',
    //   selected: false
    // },
    // {
    //   id: 3,
    //   category: 'Maju Mapan',
    //   value: 'typeMajumapan',
    //   selected: false
    // },
    // {
    //   id: 4,
    //   category: 'Semua',
    //   value: 'semua',
    //   selected: false
    // }
  ])

  const [rangePriceList, setRangePriceList] = useState<any>([
    {
      id: 1,
      range: '< Rp 99rb',
      value: 'categori1',
      selected: false
    },
    {
      id: 2,
      range: 'Rp 100rb - Rp 199rb',
      value: 'categori2',
      selected: false
    },
    {
      id: 3,
      range: 'Rp 200rb - Rp 499rb',
      value: 'categori3',
      selected: false
    },
    {
      id: 4,
      range: 'Rp 500rb - Rp 999rb',
      value: 'categori4',
      selected: false
    },
    {
      id: 5,
      range: 'Rp 1jt - Rp 5jt',
      value: 'categori5',
      selected: false
    },
    {
      id: 6,
      range: 'Rp 5jt - Rp 10jt',
      value: 'categori6',
      selected: false
    },
    {
      id: 7,
      range: 'Semua',
      value: 'semua',
      selected: false
    },
  ])

  useEffect(() => {
    updateStatusCategory();
    updateRangePrice();
  }, [category, rangePrice]);

  const setCategoryHandler = (cat: string) => {
    switch (cat) {
      case 'typeBerurut':
        if (category.typeBerurut === "false") setCategory({ ...category, typeBerurut: "true" });
        else setCategory({ ...category, typeBerurut: "false" });
        break;
      case 'typeBerulang':
        if (category.typeBerulang === "false") setCategory({ ...category, typeBerulang: "true" });
        else setCategory({ ...category, typeBerulang: "false" });
        break;
      case 'typeMajumapan':
        if (category.typeMajumapan === "false") setCategory({ ...category, typeMajumapan: "true" });
        else setCategory({ ...category, typeMajumapan: "false" });
        break;
      case 'semua':
        if (
          category.typeBerurut === "false" ||
          category.typeBerulang === "false" ||
          category.typeMajumapan === "false"
        ) {
          setCategory({
            ...category,
            typeBerurut: "true",
            typeBerulang: "true",
            typeMajumapan: "true",
            semua: "true"
          });
        } else {
          setCategory({
            ...category,
            typeBerurut: "false",
            typeBerulang: "false",
            typeMajumapan: "false",
            semua: "false"
          });
        }
        break;
      default:
        setCategory({
          ...category,
          typeBerurut: "false",
          typeBerulang: "false",
          typeMajumapan: "false",
          semua: "false"
        });
    }
  }

  const setRangePriceHandler = (range: string) => {
    switch (range) {
      case 'categori1':
        if (rangePrice.categori1 === "false") setRangePrice({ ...rangePrice, categori1: "true" });
        else setRangePrice({ ...rangePrice, categori1: "false" });
        break;
      case 'categori2':
        if (rangePrice.categori2 === "false") setRangePrice({ ...rangePrice, categori2: "true" });
        else setRangePrice({ ...rangePrice, categori2: "false" });
        break;
      case 'categori3':
        if (rangePrice.categori3 === "false") setRangePrice({ ...rangePrice, categori3: "true" });
        else setRangePrice({ ...rangePrice, categori3: "false" });
        break;
      case 'categori4':
        if (rangePrice.categori4 === "false") setRangePrice({ ...rangePrice, categori4: "true" });
        else setRangePrice({ ...rangePrice, categori4: "false" });
        break;
      case 'categori5':
        if (rangePrice.categori5 === "false") setRangePrice({ ...rangePrice, categori5: "true" });
        else setRangePrice({ ...rangePrice, categori5: "false" });
        break;
      case 'categori6':
        if (rangePrice.categori6 === "false") setRangePrice({ ...rangePrice, categori6: "true" });
        else setRangePrice({ ...rangePrice, categori6: "false" });
        break;
      case 'semua':
        if (rangePrice.categori1 === "false" ||
          rangePrice.categori2 === "false" ||
          rangePrice.categori3 === "false" ||
          rangePrice.categori4 === "false" ||
          rangePrice.categori5 === "false" ||
          rangePrice.categori6 === "false"
        ) {
          setRangePrice({
            ...rangePrice,
            categori1: "true",
            categori2: "true",
            categori3: "true",
            categori4: "true",
            categori5: "true",
            categori6: "true",
            semua: "true"
          })
        } else {
          setRangePrice({
            ...rangePrice,
            categori1: "false",
            categori2: "false",
            categori3: "false",
            categori4: "false",
            categori5: "false",
            categori6: "false",
            semua: "false"
          })
        }
        break;
      default:
        setRangePrice({
          ...rangePrice,
          categori1: "false",
          categori2: "false",
          categori3: "false",
          categori4: "false",
          categori5: "false",
          categori6: "false",
          semua: "false"
        })
    }
  }

  const updateStatusCategory = () => {
    const trueKeysCategory = Object.keys(category).filter(key => category[key] === "true");
    const updatedCategoryList = categoryList.map((item: any) => ({
      ...item,
      selected: trueKeysCategory.includes(item.value)
    }));
    setCategoryList(updatedCategoryList);
  }

  const updateRangePrice = () => {
    const trueKeysPrice = Object.keys(rangePrice).filter(key => rangePrice[key] === "true");
    const updatedRangePrice = rangePriceList.map((item: any) => ({
      ...item,
      selected: trueKeysPrice.includes(item.value)
    }));
    setRangePriceList(updatedRangePrice);
  }

  const hasTrueCategory = Object.values(category).includes("true");
  const hasTrueRangePrice = Object.values(rangePrice).includes("true");

  const onClose = () => setModal(false);

  const handleReset = () => {
    setCategory({
      ...category,
      typeBerurut: "false",
      typeBerulang: "false",
      typeMajumapan: "false",
      semua: "false"
    });
    setRangePrice({
      ...rangePrice,
      categori1: "false",
      categori2: "false",
      categori3: "false",
      categori4: "false",
      categori5: "false",
      categori6: "false",
      semua: "false"
    })
  }

  const handleFilter = () => {
    tabSelectionFilter()
    onClose();
  }

  return (
    <>
      <ModalBottomSheet
        // isOpen={modal}
        // onClose={onClose}
        // animate={true}
        modal={modal}
        setModal={onClose}
        title="Filter"
        scrollContent
        className="wrapper-filter-esim"
      >
        <div className="wrapper-content scroll-content mt-8">
          <div className="main-bonuses-item pb-6">
            {/* <div className="border-b border-light-gray pb-2">
              <div className="category">
                <div className="font-Museo-Bold text-lg mb-4">Kategori Nomor</div>
                <div className="category grid grid-cols-3 gap-3">
                  {categoryList.map((cat: any) => (
                    <div key={cat.id}>
                      <div
                        onClick={(e) => setCategoryHandler(cat.value)}
                        className={`border rounded-[16px] hover:cursor-pointer text-center hover:shadow-md px-2 py-1 md:block hidden ${cat.selected ? 'bg-green-success text-white font-bold' : 'border-green-success text-biruxl'}`}
                      >
                        <div className="font-Museo text-sm">{cat.category}</div>
                      </div>
                      <div
                        onClick={(e) => setCategoryHandler(cat.value)}
                        className={`border rounded-[16px] hover:cursor-pointer text-center hover:shadow-md px-2 py-1 md:hidden block ${cat.selected ? 'bg-green-success text-white font-bold' : 'border-green-success text-biruxl'}`}
                      >
                        <div className="font-Museo text-xs">{cat.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
            <div className="price-range">
              <div className="font-Museo-Bold text-lg mb-4">Pilih Harga</div>
              <div className="category grid grid-cols-3 gap-3">
                {rangePriceList.map((range: any) => (
                  <div key={range.id}>
                    <div
                      onClick={() => setRangePriceHandler(range.value)}
                      className={`border rounded-[16px] hover:cursor-pointer text-center hover:shadow-md px-2 py-1 ${range.selected ? 'bg-green-success text-white font-bold' : 'border-green-success text-biruxl'}`}
                    >
                      <div className="font-Museo text-xs">{range.range}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 items-center">
          <Button
            variant="axis"
            rounded
            disabled={hasTrueCategory || hasTrueRangePrice ? false : true}
            onClick={handleFilter}
          >
            <div className="flex justify-center items-center font-Museo-Medium text-white">
              <span className="button-text">Terapkan</span>
            </div>
          </Button>
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default XFilter;
