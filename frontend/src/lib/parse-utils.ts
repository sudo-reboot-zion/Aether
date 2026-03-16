/**
 * Robustly parses a Clarity number (BigInt or string) into a Javascript number.
 */
export function parseClarityNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'object' && 'value' in value) value = value.value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') {
        const p = parseInt(value, 10);
        return isNaN(p) ? 0 : p;
    }
    if (typeof value === 'number') return value;
    return Number(value) || 0;
}

/**
 * Robustly parses a Clarity principal or string into a string.
 */
export function parseClarityString(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && 'value' in value) value = value.value;
    if (typeof value === 'string') return value;
    return String(value || '');
}

/**
 * Robustly parses a Clarity boolean into a boolean.
 */
export function parseClarityBool(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object' && 'value' in value) value = value.value;
    if (typeof value === 'boolean') return value;
    return Boolean(value);
}
