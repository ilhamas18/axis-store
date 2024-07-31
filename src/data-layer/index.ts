import moment from "moment";

declare global {
  interface Window {
    dataLayer: any;
  }
}
type layerEventGA4Type = (object: {
  eventAction: "select_content" | "webstore_package";
  content_type?: string;
  content_id?: string;
  content_name?: string;
  content_section?: string;
  package_name?: string;
  package_size?: string;
  package_price?: string;
}) => void;

type layerEventGA4TypevTrx = (object: {
  transaction: string;
  product: any;
  delivery: any;
}) => void;

export const layerEventGA3 = (eventAction: string, eventLabel: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "eventPush",
    eventCategory: "Button Click",
    eventAction,
    eventLabel,
  });
};

export const layerEventGA4: layerEventGA4Type = ({
  content_type,
  content_id,
  content_name,
  content_section,
  eventAction,
  package_name,
  package_size,
  package_price,
}) => {
  window.dataLayer = window.dataLayer || [];
  const filtered = Object.entries({
    content_type,
    content_id,
    content_name,
    content_section,
    event: eventAction,
    package_name,
    package_size,
    package_price,
  }).filter(([_, value]) => typeof value !== "undefined");
  window.dataLayer.push(Object.fromEntries(filtered));
};

export const layerEventGA4Trx: layerEventGA4TypevTrx = ({
  transaction,
  product,
  delivery,
}) => {
  let dicount =
    typeof product.before_price !== "undefined" ? product.before_price : 0;
  let price = typeof product.price !== "undefined" ? product.price : 0;
  let dicountPrice = dicount - price;
  let flashPurchase = localStorage.getItem("flashPurchase");
  const flashTrx = localStorage.getItem("flashTrx");

  if (flashTrx === transaction) {
    return;
  }
  if (dicount === 0) {
    dicountPrice = 0;
  }

  flashPurchase = moment(moment.now()).format("DD-MM-YYYY HH:mm");
  let dicountPriceItem = dicount - dicountPrice;
  let courierPrice = product.price + delivery.courier?.price;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "InitiateCheckout",
    product_name: `${product.name} - ${product.kuota_full}`,
    product_value: product.price,
  });

  window.dataLayer.push({
    event: "purchase",
    timestamp: flashPurchase,
    ecommerce: {
      currency: "IDR",
      value: dicountPriceItem,
      coupon: "None",
      transaction_id: transaction,
      shipping: delivery === 0 ? delivery : courierPrice - dicountPriceItem,
      tax: 0,
      items: [
        {
          item_id: product.serviceId,
          item_name: `${product.name} ${product.kuota_full}`,
          affiliation: "AXIS",
          currency: "IDR",
          discount: dicountPrice,
          index: product.index,
          item_brand: "AXIS",
          item_category: `${product.name}`,
          item_category2: `${product.name} - ${product.type}`,
          item_list_id: "pilih_paket_kamu",
          item_list_name: "Pilih Paket Kamu",
          item_variant: product.kuota_full,
          price: dicount,
          quantity: 1,
        },
      ],
    },
  });
  localStorage.setItem("flashPurchase", flashPurchase.toString());
  localStorage.setItem("flashTrx", transaction);
};

export const layerLayananPengirimanRadio = ({
  content_name,
}: {
  content_name: string;
}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "select_content",
    content_id: "interaction",
    content_type: "Radio Button Click",
    content_name,
    content_section: "Shipping Method",
  });
  // console.log(window.dataLayer);
};
