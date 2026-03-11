/**
 * Utility for beautifying property URLs.
 * Obfuscates integer IDs into professional-looking Base36 strings.
 */

const SALT = 42819; // Random offset for obfuscation

/**
 * Encodes a numeric property ID into a string.
 * Example: 0 -> "X6Y1", 1 -> "X6Y2" (depending on SALT)
 */
export function encodePropertyId(id: number): string {
    // Add salt and convert to Base36 (alphanumeric)
    const obfuscated = (id + SALT).toString(36).toUpperCase();
    return obfuscated;
}

/**
 * Decodes an encoded string back into a numeric property ID.
 */
export function decodePropertyId(encoded: string): number {
    if (!encoded) return -1;
    try {
        const decoded = parseInt(encoded.toLowerCase(), 36) - SALT;
        return isNaN(decoded) ? -1 : decoded;
    } catch (e) {
        return -1;
    }
}
