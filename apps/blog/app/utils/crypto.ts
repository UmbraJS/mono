/**
 * Generate a short, deterministic ID from a longer input string using SHA-256 hashing
 * and base62 encoding for readability.
 *
 * @param input - The input string to hash
 * @param length - The desired length of the output (default: 8)
 * @returns A promise that resolves to a short ID string
 */
export async function getShortId(input: string, length: number = 8): Promise<string> {
  // Encode input as bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert to byte array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert to base62 string (more readable than base64)
  const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let value = BigInt("0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join(""));
  let encoded = "";

  while (value > 0n) {
    const remainder = value % 62n;
    value = value / 62n;
    encoded = base62[Number(remainder)] + encoded;
  }

  // Return truncated version
  return encoded.slice(0, length);
}

/**
 * Generate a short ID synchronously using a simple hash algorithm
 * (fallback for when crypto.subtle is not available)
 *
 * @param input - The input string to hash
 * @param length - The desired length of the output (default: 8)
 * @returns A short ID string
 */
export function getShortIdSync(input: string, length: number = 8): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let value = Math.abs(hash);
  let encoded = "";

  while (value > 0 && encoded.length < length) {
    const remainder = value % 62;
    value = Math.floor(value / 62);
    encoded = base62[remainder] + encoded;
  }

  return encoded.padStart(length, '0').slice(0, length);
}
