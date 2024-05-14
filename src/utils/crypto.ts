import CryptoJS from 'crypto-js'
import pako from 'pako'
const CRYPTO_KEY = 'yft-design'

/**
 * 加密
 * @param msg 待加密字符串
 */
export const encrypt = (msg: string) => {
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

/**
 * 解密
 * @param ciphertext 待解密字符串
 */
export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}


export const zip = (str: string) => {
  const arr = pako.deflate(str, { gzip: true } as any);
  const ret = btoa(String.fromCharCode.apply(null, arr as any));
  return ret;
}
 
export const unzip = (b64Data: string) => {
  let strData = atob(b64Data);
  const charData = strData.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  const binData = new Uint8Array(charData);
  const data = pako.inflate(binData);
  strData = new TextDecoder("utf-8").decode(data);
  return decodeURIComponent(strData);
};