import {
    uintCV,
    listCV,
    PostConditionMode,
} from "@stacks/transactions";

import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export async function saveProperty(propertyId: number) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.PROFILE,
        functionName: "save-property",
        functionArgs: [uintCV(propertyId)],
        postConditionMode: PostConditionMode.Allow,
    };
}

export async function setPreferences({
    vibes,
    amenities
}: {
    vibes: number[];
    amenities: number[];
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.PROFILE,
        functionName: "set-preferences",
        functionArgs: [
            listCV(vibes.map(v => uintCV(v))),
            listCV(amenities.map(a => uintCV(a))),
        ],
        postConditionMode: PostConditionMode.Allow,
    };
}
