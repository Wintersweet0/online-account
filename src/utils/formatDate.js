function formatMonth(date){
  let res = `${date.getFullYear()}-${date.getMonth()+1}`
  return res
}
function formatDate(date){
  let res = `${date.getMonth()+1}-${date.getDate()}`
  return res
}
export {
  formatMonth,
  formatDate
}