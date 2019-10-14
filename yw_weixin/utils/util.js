const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
const parseURL = (url) => {

  if (url && url.indexOf("?") == -1) return {}

  var startIndex = url.indexOf("?") + 1;
  var str = url.substr(startIndex);
  var strs = str.split("&");
  var param = {}
  for (var i = 0; i < strs.length; i++) {
    var result = strs[i].split("=");
    var key = result[0];
    var value = result[1];
    param[key] = value;
  }
  return param

}


module.exports = {
  parseURL: parseURL
}
