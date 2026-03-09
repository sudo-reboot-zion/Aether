import {
    uintCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { rateLimiter } from '../rate-limiter';
import { Property, Booking } from '../../redux/slices/redux.types';

export function parseClarityNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'object' && 'value' in value) value = value.value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') { const p = parseInt(value, 10); return isNaN(p) ? 0 : p; }
    if (typeof value === 'number') return value;
    return Number(value) || 0;
}

export async function getProperty(propertyId: number, retries = 3): Promise<Property | null> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.ESCROW,
                functionName: "get-property",
                functionArgs: [uintCV(propertyId)],
                senderAddress: CONTRACT_ADDRESS,
                network: NETWORK,
            }));

            if (result.type === ClarityType.OptionalNone) return null;
            if (result.type !== ClarityType.OptionalSome || !result.value) return null;

            const data = cvToValue(result.value);

            let metadataUri = data["metadata-uri"];
            if (metadataUri && typeof metadataUri === 'object' && 'value' in metadataUri) metadataUri = metadataUri.value;
            if (typeof metadataUri !== 'string') metadataUri = String(metadataUri || '');

            let owner = data.owner;
            if (owner && typeof owner === 'object' && 'value' in owner) owner = owner.value;
            if (typeof owner !== 'string') owner = String(owner || '');

            let active = data.active;
            if (active && typeof active === 'object' && 'value' in active) active = active.value;
            if (typeof active !== 'boolean') active = Boolean(active);

            return {
                id: propertyId,
                owner,
                pricePerNight: parseClarityNumber(data["price-per-night"]),
                locationTag: parseClarityNumber(data["location-tag"]),
                categoryTag: parseClarityNumber(data["category-tag"]),
                metadataUri,
                active,
                createdAt: parseClarityNumber(data["created-at"]),
            };
        } catch (error: any) {
            if (attempt === retries - 1) {
                console.error(`[EscrowRead] Final failure fetching property #${propertyId} after ${retries} attempts:`, error?.message || error);
                return null;
            }
        }
    }
    return null;
}

export async function getBooking(bookingId: number): Promise<Booking | null> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.ESCROW,
            functionName: "get-booking",
            functionArgs: [uintCV(bookingId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));

        if (result.type === ClarityType.OptionalNone) return null;
        if (result.type !== ClarityType.OptionalSome || !result.value) return null;

        const data = cvToValue(result.value);

        let guest = data.guest;
        if (guest && typeof guest === 'object' && 'value' in guest) guest = guest.value;
        if (typeof guest !== 'string') guest = String(guest || '');

        let host = data.host;
        if (host && typeof host === 'object' && 'value' in host) host = host.value;
        if (typeof host !== 'string') host = String(host || '');

        return {
            id: bookingId,
            propertyId: parseClarityNumber(data["property-id"]),
            guest,
            host,
            checkIn: parseClarityNumber(data["check-in"]),
            checkOut: parseClarityNumber(data["check-out"]),
            totalAmount: parseClarityNumber(data["total-amount"]),
            platformFee: parseClarityNumber(data["platform-fee"]),
            hostPayout: parseClarityNumber(data["host-payout"]),
            status: typeof data.status === 'object' && 'value' in data.status ? data.status.value : data.status,
            createdAt: parseClarityNumber(data["created-at"]),
            escrowedAmount: parseClarityNumber(data["escrowed-amount"]),
        };
    } catch (error: any) {
        console.error(`[EscrowRead] Error fetching booking #${bookingId}:`, error?.message || error);
        return null;
    }
}

export async function canReleasePayment(bookingId: number): Promise<boolean> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.ESCROW,
            functionName: "can-release-payment",
            functionArgs: [uintCV(bookingId)],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return result.type === ClarityType.BoolTrue;
    } catch (error: any) {
        console.error(`[EscrowRead] Error checking can-release-payment for booking #${bookingId}:`, error?.message || error);
        return false;
    }
}

export async function getPropertyNonce(): Promise<number> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.ESCROW,
            functionName: "get-property-id-nonce",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return parseClarityNumber(cvToValue(result));
    } catch (error) {
        console.error("[EscrowRead] Error fetching property nonce:", error);
        return 0;
    }
}

export async function getBookingNonce(): Promise<number> {
    try {
        const result = await rateLimiter.add(() => fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.ESCROW,
            functionName: "get-booking-id-nonce",
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network: NETWORK,
        }));
        return parseClarityNumber(cvToValue(result));
    } catch (error) {
        console.error("[EscrowRead] Error fetching booking nonce:", error);
        return 0;
    }
}
