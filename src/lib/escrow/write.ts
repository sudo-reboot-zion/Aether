import {
    uintCV,
    stringAsciiCV,
    PostConditionMode,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export async function listProperty({
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

export async function bookProperty({
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

export async function releasePayment(bookingId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "release-payment",
        functionArgs: [uintCV(bookingId)],
        postConditionMode: PostConditionMode.Allow,
    };
}

export async function cancelBooking(bookingId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "cancel-booking",
        functionArgs: [uintCV(bookingId)],
        postConditionMode: PostConditionMode.Allow,
    };
}

export async function togglePropertyStatus(propertyId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.ESCROW,
        functionName: "toggle-property-status",
        functionArgs: [uintCV(propertyId)],
        postConditionMode: PostConditionMode.Allow,
    };
}
