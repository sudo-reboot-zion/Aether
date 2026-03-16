import {
    uintCV,
    fetchCallReadOnlyFunction,
    ClarityType,
    cvToValue,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS, NETWORK } from '../config';
import { rateLimiter } from '../rate-limiter';
import { Property, Booking, BookingStatus } from '../../redux/slices/redux.types';
import { parseClarityNumber, parseClarityString, parseClarityBool } from '../parse-utils';

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
            const innerValue = result.type === ClarityType.OptionalSome ? result.value : result;
            if (!innerValue) return null;

            const data = cvToValue(innerValue) as any;

            return {
                id: propertyId,
                owner: parseClarityString(data.owner),
                pricePerNight: parseClarityNumber(data["price-per-night"]),
                locationTag: parseClarityNumber(data["location-tag"]),
                categoryTag: parseClarityNumber(data["category-tag"]),
                metadataUri: parseClarityString(data["metadata-uri"]),
                active: parseClarityBool(data.active),
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
        const innerValue = result.type === ClarityType.OptionalSome ? result.value : result;
        if (!innerValue) return null;

        const data = cvToValue(innerValue) as any;

        return {
            id: bookingId,
            propertyId: parseClarityNumber(data["property-id"]),
            guest: parseClarityString(data.guest),
            host: parseClarityString(data.host),
            checkIn: parseClarityNumber(data["check-in"]),
            checkOut: parseClarityNumber(data["check-out"]),
            totalAmount: parseClarityNumber(data["total-amount"]),
            platformFee: parseClarityNumber(data["platform-fee"]),
            hostPayout: parseClarityNumber(data["host-payout"]),
            status: parseClarityString(data.status) as BookingStatus,
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
