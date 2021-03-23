import CryptoJS from 'crypto-js';

export default class LanControlAuthenticationUtils {
    // export default class LanControlAuthenticationUtils {
    static encryptionData({ iv, key, data }: { iv: string; key: string; data: string }) {
        //加密
        try {
            //加密
            const cipher = CryptoJS.AES.encrypt(data, CryptoJS.MD5(key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
            return base64Cipher;
        } catch (e) {
            console.error(e);
        }
    }

    static decryptionData({ iv, key, data }: { iv: string; key: string; data: string }) {
        //解密
        let bytes = CryptoJS.AES.decrypt(data, CryptoJS.MD5(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        let decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        return decryptedData;
    }

    static encryptionBase64(str: string) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
    }

    static decryptionBase64(base64Str: string) {
        return CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8);
    }
}
