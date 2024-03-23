export const formValidationCheck = <T extends HTMLFormElement>(form: T): boolean => {
  let formValidate = true;
  form.querySelectorAll("input, select").forEach((el: Element) => {
    if(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      if(el.value.trim() === "") {
        formValidate = false;
        document.getElementById(`${el.id}Invalid`)?.classList.remove("display-none");
      } else {
        document.getElementById(`${el.id}Invalid`)?.classList.add("display-none");
      }
    }
  })
  return formValidate;
}

export const formJsonData = <T extends HTMLFormElement>(form: T): JsonData  => {
  const data: JsonData = {}
  form.querySelectorAll("input, select").forEach((el: Element) => {
    if(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      let keyName = '';
      switch(el.name) {
        case 'userId': keyName = 'id'; break;
        case 'userPw': keyName = 'pw'; break;
        case 'userName': keyName = 'name'; break;
        default: keyName = el.name;
      }
      data[keyName] = el.classList.contains("number-value") ? Number(el.value) : el.value;
    }
  });
  return data;
}