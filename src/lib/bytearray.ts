import {base64DecToArr, base64EncArr} from "$lib/base64";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

export function utf8ToByteArray(input: string): Uint8Array {
  return utf8Encoder.encode(input);
}

export function byteArrayToUtf8(input: Uint8Array): string {
  if (!input) {
    return '';
  }
  return utf8Decoder.decode(input);
}

export function base64ToByteArray(input: string): Uint8Array {
  return base64DecToArr(input);
}

export function byteArrayToBase64(input: Uint8Array): string {
  if (!input) {
    return '';
  }
  return base64EncArr(input);
}
