const moment = require('moment');

function ConvertDateFormat(inputDate) {
  const formattedDate = moment(inputDate).format('YYYY-MM-DD hh:mm A');
  const stringWithHyphens = formattedDate.replace(/\//g, '-');
  return stringWithHyphens;
}

module.exports = { ConvertDateFormat };
