function FormatDate(inputDate) {
    const date = new Date(inputDate);
  
    // Get day, month, year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
  
    // Get hours, minutes, seconds
    let hours = date.getUTCHours(); // Get hours in UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    // Convert hours to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12
  
    // Format the date and time
    const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  
    return formattedDate;
  }
  
module.exports={FormatDate}
