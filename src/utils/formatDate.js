// 将日期类型格式化成为年月字符串
function formatMonth(date){
  let res = `${date.getFullYear()}-${date.getMonth()+1}`
  return res
}
// 将日期类型格式化成为月日字符串
function formatDate(date){
  let res = `${date.getMonth()+1}-${date.getDate()}`
  return res
}
export {
  formatMonth,
  formatDate
}