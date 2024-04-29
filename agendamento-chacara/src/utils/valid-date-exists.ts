export const dateExist = (date: string) => {
    const day = Number(date.split("/")[0]);
  
    if (day > 31 || day <= 0) {
      return false;
    }
  
    const month = Number(date.split("/")[1]);
  
    if (month > 12 || month <= 0) {
      return false;
    }
  
    return true;
  };