export const timeCheck = () => {
    if (localStorage.length === 0){
        return 0;
    }
    const now = new Date();
    const obj = JSON.parse(localStorage.getItem(localStorage.key(0)));

    if (now.getTime() >= obj.expire) {
      localStorage.clear();
      return 0;
    }
    return obj.time;
}