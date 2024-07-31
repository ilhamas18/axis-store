export const filterSpecialCharacters = (str: any) => {
  let filterParam = str.replace(/[`~!#$%^&*_|\=?;'"<>\{\}\[\]\\\/]/gi, "");
  return filterParam;
};