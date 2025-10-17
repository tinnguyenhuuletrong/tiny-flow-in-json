import pako from "pako";

function base64ToUrlSafe(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function urlSafeToBase64(urlSafe: string): string {
  let base64 = urlSafe.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64;
}

/**
 * Encodes a JSON object into a URL-safe string.
 * The process is: JSON -> string -> compressed -> Base64url
 * @param jsonString The JSON string to encode.
 * @returns A URL-safe string.
 */
export function encodeJsonForUrl(jsonString: string): string {
  const compressed = pako.deflate(jsonString);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
  return base64ToUrlSafe(base64);
}

/**
 * Decodes a URL-safe string back into a JSON object.
 * The process is: Base64url -> decompressed -> string -> JSON
 * @param encoded The encoded string.
 * @returns The decoded JSON string.
 */
export function decodeJsonFromUrl(encoded: string): string {
  const base64 = urlSafeToBase64(encoded);
  const compressed = atob(base64)
    .split("")
    .map((c) => c.charCodeAt(0));
  const jsonString = pako.inflate(new Uint8Array(compressed), { to: "string" });
  return jsonString;
}
