const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const asciiDecoder = new TextDecoder('ascii');

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
  const ascii = atob(input);
  return Uint8Array.from(Array.from(ascii).map(c => c.charCodeAt(0)));
}

export function byteArrayToBase64(input: Uint8Array): string {
  if (!input) {
    return '';
  }
  const decoded = asciiDecoder.decode(input);
  return btoa(decoded);
}
