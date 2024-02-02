import axios from "axios";

// TODO:久乗にインストールすることを促す

const EXPRESS_URL = "http://localhost:8000";
// ミドルウェア通す関数
const addHeaderMiddleware = () => {
  // 認証用ヘッダの取得
  // TODO:header使わなくなったので後で消す
  // const sitePasswordToken: string = document.cookie.replace(
  //   /(?:(?:^|.*;\s*)x-site-password-token\s*\=\s*([^;]*).*$)|^.*$/,
  //   "$1"
  // );
  // const accessToken: string = document.cookie.replace(
  //   /(?:(?:^|.*;\s*)x-login-token\s*\=\s*([^;]*).*$)|^.*$/,
  //   "$1"
  // );

  return axios.create({
    baseURL: EXPRESS_URL,
    headers: {
      "Content-Type": "application/json",
      // "x-site-password-token": sitePasswordToken,
      // Authorization: `Bearer ${accessToken}`,
    },
  });
};

const addSitePasswordHeader = () => {
  // TODO:headerに乗せなくなったので後で消す
  // const sitePasswordToken = document.cookie.replace(
  //   /(?:(?:^|.*;\s*)x-site-password-token\s*\=\s*([^;]*).*$)|^.*$/,
  //   "$1"
  // );

  return axios.create({
    baseURL: EXPRESS_URL,
    headers: {
      "Content-Type": "application/json",
      // "x-site-password-token": sitePasswordToken,
    },
  });
};

const sendSitePassword = async (sitePassword: String) => {
  try {
    const response = await axios.post(`${EXPRESS_URL}/site-password`, { password: sitePassword }, { withCredentials: true } );

    console.log(response);
    console.log(response.data.token);

    return {
      errorFlag: false,
      token: response.data.token,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log(e);
      console.log(e.response);
      console.log(e.response.data.message);
      return {
        errorFlag: true,
        message: e.response.data.message,
      };
    }
  }
}


// ログインから1時間経ってログイントークンが切れた時に発火する関数
// authenticateミドルウェアから401かつ"トークンの有効期限が切れています"を判定条件にする
// e.response.data.message -> エラーメッセージが詰まってる. e.response.status -> ステータスコードが詰まってる
const handleExpiredToken = async (requestUrl: string, sendMethodFlag: string, postDataToSend?: Object) => {
  const response = await axios.post(`${EXPRESS_URL}/refresh`, {}, {
    withCredentials: true
  });
  
  console.log("/refreshからのresponse");
  console.log(response);

  // この時点で新しいアクセストークンがcookieに保存されているはず
  try {
    if (sendMethodFlag === "GET") {
      const newResponse = await axios.get(`${EXPRESS_URL}${requestUrl}`, { 
        withCredentials: true
      });
  
      const newResopnseData = newResponse.data;
      return {
        status: "OK",
        responseData: newResopnseData
      };
    } else if (sendMethodFlag === "POST") {
      const newResponse = await axios.post(`${EXPRESS_URL}${requestUrl}`, postDataToSend, {
        withCredentials: true
      });
      const newResponseData = newResponse.data;
      return {
        status: "OK",
        responseData: newResponseData
      };
    } else {
      console.log("flagが適切な値になっていない");
      return {
        status: "NG",
        responseData: "flagが適切な値になっていません。"
      };
    }
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log("GET.POST再送信でエラーが発生した");
      console.log(e.response);

      return {
        status: "NG",
        responseData: "GET.POST再送信でエラーが発生しました。"
      }
    }
    return {
      status: "NG",
      responseData: "判定出来ないエラーが発生しました。"
    }
  }
}
export { addHeaderMiddleware, addSitePasswordHeader, sendSitePassword, handleExpiredToken, EXPRESS_URL }