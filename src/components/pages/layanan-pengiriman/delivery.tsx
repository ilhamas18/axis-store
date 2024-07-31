import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import XFormDelivery from './modal/XFormDelivery';
import TextInput from '@components/templates/text-input/input';
import { GrNext } from "react-icons/gr";

interface DeliveryProps {
  delivery: any;
  isFilled: boolean;
  setIsFilled: any;
  address: string;
  setAddress: any;
  information: string;
  setInformation: any;
  uuid: string;
}

const Delivery = ({
  delivery,
  isFilled,
  setIsFilled,
  address,
  setAddress,
  information,
  setInformation,
  uuid
}: DeliveryProps) => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<any>({
    province: delivery?.province !== '' ? delivery?.province : '',
    city: delivery?.cityType !== '' && delivery.city !== '' ? delivery?.cityType + ' - ' + delivery?.city : '',
    district: delivery?.district !== '' ? delivery?.district : '',
    subDistrict: delivery?.subdistrict !== '' ? delivery?.subdistrict : '',
    zipCode: delivery?.zipcode !== '' ? delivery?.zipcode : ''
  });

  const [errorDetail, setErrorDetail] = useState<any>();
  const [errorInfo, setErrorInfo] = useState<any>();

  return (
    <div className='form-container '>
      {isFilled ? (
        <div className='bg-white border-2 border-light-gray rounded-xl p-4 flex relative mt-4 hover:cursor-pointer' onClick={() => setOpenModal(true)}>
          <div className='font-Axiata-Book text-sm absolute -top-[10px] text-deep-gray bg-white px-2'>1. Wilayah (wajib diisi)</div>
          <div className='text font-Axiata-Book text-sm w-full flex justify-between'>
            <div>
              <ol>
                <li>1. Provinsi - {delivery?.province}</li>
                <li>2. {delivery?.cityType} - {delivery?.city}</li>
                <li>3. Kecamatan - {delivery?.district}</li>
                <li>4. Kelurahan - {delivery?.subdistrict}</li>
                <li>5. Kode Pos - {delivery?.zipcode}</li>
              </ol>
            </div>
            <div><GrNext size={19} /></div>
          </div>
        </div>
      ) : (
        <div className='bg-white border-2 border-gray-dark rounded-xl py-4 hover:cursor-ponter px-4 mt-3 hover:cursor-pointer' onClick={() => setOpenModal(true)}>
          <div className='w-full flex justify-between'>
            <div className='flex text-xs font-Axiata-Book text-deep-gray'>1. Ketik wilayah (wajib diisi)</div>
            <div><GrNext size={16} /></div>
          </div>
        </div>
      )}
      <div className="font-Axiata-Book flex items-center justify-center mt-2">
        <TextInput
          type="text-area"
          id="address"
          name="address"
          label="2. Alamat lengkap (wajib diisi)"
          value={address}
          change={(e: any) => {
            setAddress(e);
            if (e == "") {
              setInformation("");
              setErrorDetail("Mohon isi detail alamat");
            } else {
              setErrorDetail(false);
            }
          }}
          errors={errorDetail}
          variant={"secondary"}
        />
      </div>
      <div className="font-Axiata-Book flex items-center justify-center mt-2">
        <TextInput
          type="text-area"
          id="information"
          name="information"
          max={60}
          label=" 3. Catatan tambahan (tidak wajib diisi)"
          placeholder="Maksimal 60 Karakter"
          value={information}
          change={(e: any) => {
            setInformation(e);
            if (e == "") {
              setInformation("");
              setErrorInfo(false);
            } else {
              setErrorInfo(false);
            }
          }}
          errors={errorInfo}
          variant={"secondary"}
        />
      </div>
      <XFormDelivery
        openModal={openModal}
        setOpenModal={setOpenModal}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        setFilled={setIsFilled}
        uuid={uuid}
      />
    </div>
  )
}

export default Delivery