"use client";

import { useTxPoller } from "@/hooks/useTxPoller";

/**
 * Empty component that simply mounts the useTxPoller hook
 * globally inside the StoreProvider.
 */
export default function TxPollerMount() {
    useTxPoller();
    return null;
}
