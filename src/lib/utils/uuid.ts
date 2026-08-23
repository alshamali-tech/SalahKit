/**
 * Id generation (S3: utils/uuid.ts). Prefers crypto.randomUUID().
 */

/**
 * Generates a RFC4122 v4 UUID.
 * Uses crypto.randomUUID when available, otherwise falls back to
 * crypto.getRandomValues with the required version/variant bits set.
 * @returns A lowercase UUID string.
 * @throws Error when no cryptographic source is available.
 */
export function uuid(): string {
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  throw new Error('SalahKit: no cryptographic random source available.');
}
