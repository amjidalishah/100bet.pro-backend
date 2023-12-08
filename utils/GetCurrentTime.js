function GetCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = now.getHours() < 12 ? 'AM' : 'PM';
  
    const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    return currentTime;
  }


  
  module.exports={GetCurrentTime}
