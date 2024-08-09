import Swal from "sweetalert2";

export const successMessage = (string) => {
  Swal.fire({
    title: "알림",
    icon:'success',
    html: string,
    showCancelButton: false,
    confirmButtonText: "확인",
  }).then(() => {});
}

export const errorMessage = (string) => {
    Swal.fire({
      title: "에러",
      icon:'error',
      html: string,
      showCancelButton: false,
      confirmButtonText: "확인",
    }).then(() => {});
}

export const inputNumber = (string) => {
  return Swal.fire({
    title: string,
    input: 'text',
    inputAttributes: {
      autocomplete: 'off' // 자동완성 기능 끄기
    },
    confirmButtonText: "입력 완료",
  }).then((result) => {
    // result.value가 존재하는지 확인
    if (result.value) {
      const inputValue = parseInt(result.value);
      // 범위 조건 체크
      if (inputValue >= 400 && inputValue <= 1050) {
        return inputValue; // 유효한 입력값 반환
      }
    }
    return 0; // 유효하지 않거나 입력이 없을 경우 0 반환
  });
}