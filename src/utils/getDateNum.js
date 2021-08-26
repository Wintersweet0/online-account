// 获得该日期所在月份的天数，比如2021-08-05在八月，八月共有31天，那么返回31
export default function getDateNum(value) {
  let date = new Date(value);
  let year = date.getFullYear();
  let month = date.getMonth() +1;
  let d = new Date(year, month, 0);
  return d.getDate();
}