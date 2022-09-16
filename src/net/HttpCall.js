import { isEmpty, isEqual } from "../utils/ObjectUtil";
import { NETWORK_BASE_URL } from "./BaseUrl";
import AppConfigs from "../config/AppConfigs";

/**
 * 网络请求 封装
 */

const TIMEOUT = 15 * 1000; // 默认15秒超时
const CONTENT_TYPE = "application/json;charset=UTF-8";

export default class HttpCall {
  /**
   * 发起网络请求
   */
  static request = async (method, url, params, timeout, contentType) => {
    let headerOptions;
    let queryUrl;
    let header = AppConfigs; // 请求头信息
    if (!isEmpty(header)) {
      let host = NETWORK_BASE_URL(header.ENV);
      if (isEqual(method, "POST")) {
        if (contentType === "multipart/form-data") {
          headerOptions = {
            method: method,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-cache",
              ...header,
            },
            body: params,
          };
        } else {
          headerOptions = {
            method: method,
            headers: {
              Accept: "application/json",
              "Content-Type": contentType,
              ...header,
            },
            body: JSON.stringify(params),
          };
        }
        if (url.startsWith("https://")) {
          queryUrl = `${url}`;
        } else {
          queryUrl = `${host}${url}`;
        }
      } else {
        headerOptions = {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": contentType,
            ...header,
          },
        };
        queryUrl = `${host}${url}${params}`;
      }
    }

    let isOK;
    let error = {};

    let requestPromise = new Promise((resolve, reject) => {
      fetch(queryUrl, headerOptions)
        .then((response) => {
          isOK = response.ok;
          return response.json();
        })
        .then((responseData) => {
          console.log(JSON.stringify(responseData));
          if ([0, "200", "0"].includes(responseData.code) || responseData.result === "Success") {
            // 1, 请求成功
            if (!isEmpty(responseData.data)) {
              // 2, 判断 data 是否存在
              resolve(responseData.data);
            } else {
              resolve(responseData);
            }
          } else {
            reject(responseData);
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          // 异常处理
          let error = {};
          if (isEqual(err.message, "Network request failed")) {
            error = {
              code: 6001,
              msg: "网络请求失败，请检查你的网络设置",
            };
            reject(error);
          } else if (err.response && err.response.status) {
            error = {
              code: err.response.status,
              msg: "网络异常，请检查您的网络设置",
            };
            switch (err.response.status) {
              case 401:
              case 404:
              case 500:
              case 502:
                break;
              default:
                break;
            }
            reject(error);
          }
        });
    });
    let result;
    error = {
      code: 504,
      msg: "网络请求超时，请检查您的网络设置",
    };
    result = await new Promise.race([
      this.timeoutPromise(timeout),
      requestPromise,
    ]);
    if (isEqual(result.status, 504)) {
      result.reject({ error });
    }
    return result;
  };

  /**
   * POST 请求
   */
  static async post(url, params, timeout = 30 * 1000) {
    // 加工参数
    let paramsObj = this.disposeParams(params);
    return await this.request("POST", url, paramsObj, timeout, CONTENT_TYPE);
  }

  /**
   * GET 请求
   */
  static async get(url, params = {}, timeout = TIMEOUT) {
    // 加工参数
    let paramsObj = this.disposeParams(params);
    let requestParams;
    let paramsArray = [];
    // 拼接参数
    Object.keys(paramsObj).forEach((key) =>
      paramsArray.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(paramsObj[key]),
      ),
    );
    if (url.search(/\?/) === -1) {
      requestParams = "?" + paramsArray.join("&");
    } else {
      requestParams = "&" + paramsArray.join("&");
    }
    return await this.request("GET", url, requestParams, timeout, CONTENT_TYPE);
  }

  /**
   * 文件上传(单个文件上传)
   */
  static async uploadFile(url, filePath, timeout = TIMEOUT) {
    let formData = new FormData();
    let fileData = {
      uri: filePath,
      type: "image/jpeg",
      name: "image.jpg",
    };
    formData.append("file", fileData);
    // 加工参数
    return await this.request(
      "POST",
      url,
      formData,
      timeout,
      "multipart/form-data",
    );
  }

  /**
   * 超时设定
   */
  static timeoutPromise = (timeout) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: false, status: 504, statusText: "timeout" });
      }, timeout);
    });
  };

  /**
   * 处理参数 加时间戳
   * @param params
   * @returns {any}
   */
  static disposeParams(params) {
    //获取当前时间戳
    const timestamp = new Date().getTime();
    return Object.assign(params, { timestamp: timestamp });
  }
}
