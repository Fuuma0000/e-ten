import axios from "axios";

// TODO:久乗にインストールすることを促す

const EXPRESS_URL = "http://localhost:8000";
// ミドルウェア通す関数
const addHeaderMiddleware = () => {
    // 認証用ヘッダの取得
    const sitePasswordToken: string = document.cookie.replace(/(?:(?:^|.*;\s*)x-site-password-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const accessToken: string = document.cookie.replace(/(?:(?:^|.*;\s*)x-login-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    return axios.create({
      baseURL: EXPRESS_URL,
      headers: {
        "Content-Type": "application/json",
        "x-site-password-token": sitePasswordToken,
        "Authorization": `Bearer ${accessToken}`
      }
    });
}

const addSitePasswordHeader = () => {
  const sitePasswordToken = document.cookie.replace(/(?:(?:^|.*;\s*)x-site-password-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  return axios.create({
    baseURL: EXPRESS_URL,
    headers: {
      "Content-Type": "application/json",
      "x-site-password-token": sitePasswordToken
    }
  })
}

const sendSitePassword = async (sitePassword: String) => {
  try {
    const response = await axios.post(`${EXPRESS_URL}/site-password`, {
      password: sitePassword
    });
    console.log(response);
    console.log(response.data.token);
    return {
      errorFlag: false, 
      token: response.data.token
    };
  } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
      console.log(e.response.data.message);
      return {
        errorFlag: true,
        message: e.response.data.message
    }
    }
  }
}
export { addHeaderMiddleware, addSitePasswordHeader, sendSitePassword }