type CallBackFunction = (res: BackendResponseData) => any;
type ErrorFunction = (err: any) => any;

export const ajax = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  try {
    const data: BackendResponseData = await (await fetch(url, { method: "GET", credentials: "include", ...option, headers: { "Content-Type": "application/json", ...option?.headers }})).json();
    if(callBack) { callBack(data); }
    else {
      if(data.message === "success") {
        alert("성공");
      } else {
        alert(data.message);
      }
    }
    return data.action;
  } catch (err) {
    if(error) error(err);
    else console.log("오류");
  }
}

export const get = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  return await ajax(url, { ...option, method: "GET" }, callBack, error);
}

export const post = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  return await ajax(url, { ...option, method: "POST" }, callBack, error);
}

export const put = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  return await ajax(url, { ...option, method: "PUT" }, callBack, error);
}

export const patch = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  return await ajax(url, { ...option, method: "PATCH" }, callBack, error);
}

export const del = async (url: string | Request | URL, option?: RequestInit, callBack?: CallBackFunction, error?: ErrorFunction) => {
  return await ajax(url, { ...option, method: "DELETE" }, callBack, error);
}