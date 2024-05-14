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
  // const binaryString = pako.gzip(encodeURIComponent(str), { level: 9 })
  const binaryString = pako.gzip(encodeURIComponent(str), {to: 'string'})
  return btoa(binaryString);
}
 
export const unzip = (b64Data: string) => {
  var strData = atob(b64Data);
  var charData = strData.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  var binData = new Uint8Array(charData);
  var data = pako.inflate(binData);
  var strData = new TextDecoder("utf-8").decode(data);
  return decodeURIComponent(strData);
};