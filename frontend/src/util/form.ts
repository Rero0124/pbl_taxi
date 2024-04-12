export const formValidationCheck = <T extends HTMLFormElement>(form: T): boolean => {
  let formValidate = true;
  form.querySelectorAll("input, select").forEach((el: Element) => {
    if(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
      const invalidEl = document.getElementById(`${el.name}Invalid`);
      if(el.type === "radio") {
        if(form[el.name].value.trim() === "") {
          formValidate = false;
          if(invalidEl) invalidEl.style.display = "block";
        } else {
          if(invalidEl) invalidEl.style.display = "none";
        }
      } else {
        if(el.value.trim() === "" && !el.classList.contains("not-validation")) {
          formValidate = false;
          if(invalidEl) invalidEl.style.display = "block";
        } else {
          if(invalidEl) invalidEl.style.display = "none";
        }
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
      if(el.type === "radio") {
        data[keyName] = el.classList.contains("number-value") ? Number(form[el.name].value) : el.classList.contains("boolean-value") ? form[el.name].value === "true" : form[el.name].value;
      } else {
        data[keyName] = el.classList.contains("number-value") ? Number(el.value) : el.classList.contains("boolean-value") ? el.value === "true" : el.value;
      }
    }
  });
  return data;
}