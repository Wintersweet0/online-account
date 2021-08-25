export default function getDateNum(value) {
  let date = new Date(value);
  let year = date.getFullYear();
  let month = date.getMonth() +1;
  let d = new Date(year, month, 0);
  return d.getDate();
}