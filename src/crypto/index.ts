import * as crypto from "crypto";

type Encryptor = (buf: Buffer) => Buffer;
type Decryptor = (buf: Buffer) => Buffer;

type AESEncryptor = (iv: Buffer, key: Buffer) => Encryptor;
type AESDecryptor = (iv: Buffer, key: Buffer) => Decryptor;

export namespace sairiCrypt {
  export const encrypt: (publicKey: string) => Encryptor =
    (publicKey) => (buf) => {
      return crypto.publicEncrypt(publicKey, buf);
    };

  export const decrypt: (privateKey: string) => Decryptor =
    (privateKey) => (buf) => {
      return crypto.privateDecrypt(privateKey, buf);
    };

  export const encryptAES: AESEncryptor = (iv, key) => (buf) => {
    if (key.byteLength * 8 !== 256)
      throw new Error("Keyは256ビットである必要があります");

    // 暗合器を生成
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(buf);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted;
  };

  export const decryptAES: AESDecryptor = (iv, key) => (buf) => {
    if (key.byteLength * 8 !== 256)
      throw new Error("Keyは256ビットである必要があります");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(buf);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  };

  export function generateIV(): Buffer {
    return crypto.randomBytes(16);
  }

  export function generate256BitKey(): Buffer {
    return crypto.randomBytes(256 / 8);
  }
}
