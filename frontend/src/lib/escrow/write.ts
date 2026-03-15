import {
    uintCV,
    stringAsciiCV,
    PostConditionMode,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export function listProperty({
    pricePerNight,
    locationTag,
    categoryTag,
    metadataUri,
}: {
    pricePerNight: number;
    locationTag: number;
    categoryTag: number;
    metadataUri: string;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "list-property",
        functionArgs: [
            uintCV(pricePerNight),
            uintCV(locationTag),
            uintCV(categoryTag),
            stringAsciiCV(metadataUri),
        ],
    };
}

export function bookProperty({
    propertyId,
    checkIn,
    checkOut,
    numNights,
}: {
    propertyId: number;
    checkIn: number;
    checkOut: number;
    numNights: number;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "book-property",
        functionArgs: [
            uintCV(propertyId),
            uintCV(checkIn),
            uintCV(checkOut),
            uintCV(numNights),
        ],
    };
}

export function releasePayment(bookingId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "release-payment",
        functionArgs: [uintCV(bookingId)],
        postConditionMode: PostConditionMode.Allow,
    };
}

export function cancelBooking(bookingId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "cancel-booking",
        functionArgs: [uintCV(bookingId)],
        postConditionMode: PostConditionMode.Allow,
    };
}

export function togglePropertyStatus(propertyId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "toggle-property-status",
        functionArgs: [uintCV(propertyId)],
        postConditionMode: PostConditionMode.Allow,
    };
}
