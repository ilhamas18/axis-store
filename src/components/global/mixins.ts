export const priceNumber = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

export const openA = (url: any) => {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href = url;
  a.click();
};

export const priceNumberEmail = (number: number) => {
  let str = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
  return str.replace("Rp", "");
};

export const prependZero = (number: number, limit: number) => {
  return number < limit ? `0${number}` : number;
};

export const checkDevice = () => {
  if (typeof window !== "undefined") {
    const agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("iphone") != -1) {
      return "iPhone";
    } else if (agent.indexOf("android") != -1) {
      return "Android";
    } else {
      return "Browser";
    }
  }
};

export const checkDate = (date: string) => {
  let objectDate = new Date(date);
  let day = objectDate.getDate();
  let month = objectDate.getMonth();
  let year = objectDate.getFullYear();
  let hour = objectDate.getHours();
  let mnt = objectDate.getMinutes();
  let minute =
    mnt.toString().length > 1
      ? objectDate.getMinutes()
      : "0" + objectDate.getMinutes();
  let fixDate =
    day + "-" + (month + 1) + "-" + year + " " + hour + ":" + minute + " WIB";

  return fixDate;
};

export const checkDateSecond = (date: string) => {
  let objectDate = new Date(date);
  let day = objectDate.getDate();
  let month = objectDate.getMonth();
  let year = objectDate.getFullYear();
  let hour = objectDate.getHours();
  let mnt = objectDate.getMinutes();
  let minute =
    mnt.toString().length > 1
      ? objectDate.getMinutes()
      : "0" + objectDate.getMinutes();
  let second = objectDate.getSeconds();
  let fixDate =
    day +
    "-" +
    (month + 1) +
    "-" +
    year +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second +
    " WIB";

  return fixDate;
};

export const isEmptyObj = (obj: object) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
};

export const separateNumberString = (str: string) => {
  const matches = str.match(/(\d+)([a-zA-Z]+)/);
  let number = "";
  let text = "";
  if (matches) {
    number = matches[1];
    text = matches[2];
  }
  return { number, text };
};

export const getQueryParam = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};
