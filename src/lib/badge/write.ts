import { principalCV, uintCV, stringAsciiCV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export async function mintBadge({
    recipient,
    badgeType,
    metadataUri,
}: {
    recipient: string;
    badgeType: number;
    metadataUri: string;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.BADGE,
        functionName: "mint-badge",
        functionArgs: [
            principalCV(recipient),
            uintCV(badgeType),
            stringAsciiCV(metadataUri),
        ],
    };
}
