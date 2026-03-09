import { principalCV, uintCV, stringUtf8CV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACTS } from '../config';

export async function submitReview({
    bookingId,
    reviewee,
    rating,
    comment,
}: {
    bookingId: number;
    reviewee: string;
    rating: number;
    comment: string;
}) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACTS.REPUTATION,
        functionName: "submit-review",
        functionArgs: [
            uintCV(bookingId),
            principalCV(reviewee),
            uintCV(rating),
            stringUtf8CV(comment),
        ],
    };
}
