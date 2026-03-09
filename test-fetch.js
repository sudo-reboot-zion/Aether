import { principalCV, uintCV, fetchCallReadOnlyFunction } from "@stacks/transactions";

async function test() {
  try {
    console.log("Fetching...");
    const res = await fetchCallReadOnlyFunction({
      contractAddress: "ST3E8FRVZKVZMMD0FD8DMKWYX2XDCSGF538KHDCWQ",
      contractName: "badge",
      functionName: "get-badge-type-info",
      functionArgs: [uintCV(4)],
      senderAddress: "ST3E8FRVZKVZMMD0FD8DMKWYX2XDCSGF538KHDCWQ",
      network: "testnet"
    });
    console.log(res);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
